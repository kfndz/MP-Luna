import { Router } from "express";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

import { requireAdminAuth } from "../middlewares/requireAdminAuth.js";

const router = Router();

const DEFAULT_MAX_VIDEO_SIZE_MB = 500;
const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v",
  "video/ogg",
]);

const EXTENSION_BY_TYPE: Record<string, string> = {
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
  "video/x-m4v": ".m4v",
  "video/ogg": ".ogg",
};

const TYPE_BY_EXTENSION: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".m4v": "video/x-m4v",
  ".ogg": "video/ogg",
};

function getMaxVideoSize() {
  const configuredMb = Number(process.env.MAX_VIDEO_UPLOAD_MB);
  const maxMb =
    Number.isFinite(configuredMb) && configuredMb > 0
      ? configuredMb
      : DEFAULT_MAX_VIDEO_SIZE_MB;

  return Math.floor(maxMb * 1024 * 1024);
}

function getUploadsRoot() {
  return path.resolve(
    process.env.UPLOADS_DIR || path.join(process.cwd(), "storage", "uploads"),
  );
}

function sanitizeBaseName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 120);
}

function getDecodedFileName(headerValue: unknown) {
  const rawNameHeader = String(headerValue || "video");

  try {
    return decodeURIComponent(rawNameHeader);
  } catch {
    return rawNameHeader;
  }
}

function resolveVideoFormat(contentTypeHeader: unknown, fileName: string) {
  const declaredType = String(contentTypeHeader || "")
    .split(";")[0]
    .trim()
    .toLowerCase();
  const extension = path.extname(fileName).toLowerCase();

  if (ALLOWED_VIDEO_TYPES.has(declaredType)) {
    return {
      contentType: declaredType,
      extension: EXTENSION_BY_TYPE[declaredType],
    };
  }

  const typeFromExtension = TYPE_BY_EXTENSION[extension];
  if (typeFromExtension) {
    return {
      contentType: typeFromExtension,
      extension,
    };
  }

  return null;
}

// Permite validar na Hostinger se a pasta persistente está gravável.
router.get("/status", requireAdminAuth, async (_req, res) => {
  const videosDir = path.join(getUploadsRoot(), "videos");
  const probePath = path.join(
    videosDir,
    `.write-test-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
  );

  try {
    await fs.promises.mkdir(videosDir, { recursive: true });
    await fs.promises.writeFile(probePath, "ok", { flag: "wx" });
    await fs.promises.unlink(probePath);

    return res.json({
      ok: true,
      uploadsDir: videosDir,
      maxVideoSizeMb: Math.round(getMaxVideoSize() / 1024 / 1024),
    });
  } catch (error) {
    console.error("Pasta de upload sem permissão de escrita:", error);

    return res.status(500).json({
      ok: false,
      message:
        "A pasta de vídeos não está gravável. Configure UPLOADS_DIR para uma pasta persistente com permissão de escrita.",
    });
  }
});

router.post("/", requireAdminAuth, async (req, res) => {
  const decodedName = getDecodedFileName(req.headers["x-file-name"]);
  const format = resolveVideoFormat(req.headers["content-type"], decodedName);

  if (!format) {
    return res.status(415).json({
      message: "Formato não suportado. Use MP4, WEBM, MOV, M4V ou OGG.",
    });
  }

  const maxVideoSize = getMaxVideoSize();
  const declaredLength = Number(req.headers["content-length"] || 0);
  if (declaredLength > maxVideoSize) {
    return res.status(413).json({
      message: `O vídeo deve ter no máximo ${Math.round(maxVideoSize / 1024 / 1024)} MB.`,
    });
  }

  const parsed = path.parse(decodedName);
  const safeBase = sanitizeBaseName(parsed.name) || "video";
  const uniqueName = `${Date.now()}-${crypto.randomBytes(5).toString("hex")}-${safeBase}${format.extension}`;

  const videosDir = path.join(getUploadsRoot(), "videos");

  try {
    await fs.promises.mkdir(videosDir, { recursive: true });
  } catch (error) {
    console.error("Erro ao preparar pasta de vídeos:", error);

    return res.status(500).json({
      message:
        "Não foi possível preparar a pasta de vídeos. Verifique as permissões de escrita do servidor.",
    });
  }

  const absolutePath = path.join(videosDir, uniqueName);
  const output = fs.createWriteStream(absolutePath, { flags: "wx" });

  let receivedBytes = 0;
  let finished = false;

  const cleanupPartialFile = async () => {
    try {
      await fs.promises.unlink(absolutePath);
    } catch {
      // Arquivo pode ainda não existir ou já ter sido removido.
    }
  };

  req.on("data", (chunk: Buffer) => {
    receivedBytes += chunk.length;

    if (receivedBytes > maxVideoSize && !finished) {
      finished = true;
      req.unpipe(output);
      output.destroy();
      void cleanupPartialFile();

      if (!res.headersSent) {
        res.status(413).json({
          message: `O vídeo deve ter no máximo ${Math.round(maxVideoSize / 1024 / 1024)} MB.`,
        });
      }

      req.resume();
    }
  });

  req.on("aborted", () => {
    if (!finished) {
      finished = true;
      output.destroy();
      void cleanupPartialFile();
    }
  });

  req.on("error", async (error) => {
    if (finished) return;
    finished = true;
    output.destroy();
    await cleanupPartialFile();
    console.error("Erro durante o recebimento do vídeo:", error);

    if (!res.headersSent) {
      res.status(500).json({
        message: "A conexão foi interrompida durante o envio do vídeo.",
      });
    }
  });

  output.on("error", async (error) => {
    if (finished) return;
    finished = true;
    await cleanupPartialFile();
    console.error("Erro ao salvar vídeo:", error);

    if (!res.headersSent) {
      res.status(500).json({
        message:
          "Não foi possível salvar o vídeo no servidor. Verifique o espaço em disco e as permissões da pasta de uploads.",
      });
    }
  });

  output.on("finish", () => {
    if (finished) return;
    finished = true;

    return res.status(201).json({
      url: `/uploads/videos/${uniqueName}`,
      fileName: uniqueName,
      size: receivedBytes,
      contentType: format.contentType,
    });
  });

  req.pipe(output);
});

export { router as uploadVideoRoute, getUploadsRoot };
