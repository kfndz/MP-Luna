import { Router } from "express";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

import { requireAdminAuth } from "../middlewares/requireAdminAuth.js";

const router = Router();

const MAX_VIDEO_SIZE = 500 * 1024 * 1024;
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

router.post("/", requireAdminAuth, async (req, res) => {
  const contentType = String(req.headers["content-type"] || "")
    .split(";")[0]
    .trim()
    .toLowerCase();

  if (!ALLOWED_VIDEO_TYPES.has(contentType)) {
    return res.status(415).json({
      message: "Formato não suportado. Use MP4, WEBM, MOV, M4V ou OGG.",
    });
  }

  const declaredLength = Number(req.headers["content-length"] || 0);
  if (declaredLength > MAX_VIDEO_SIZE) {
    return res.status(413).json({
      message: "O vídeo deve ter no máximo 500 MB.",
    });
  }

  const rawNameHeader = String(req.headers["x-file-name"] || "video");
  let decodedName = "video";

  try {
    decodedName = decodeURIComponent(rawNameHeader);
  } catch {
    decodedName = rawNameHeader;
  }

  const parsed = path.parse(decodedName);
  const safeBase = sanitizeBaseName(parsed.name) || "video";
  const extension = EXTENSION_BY_TYPE[contentType] || ".mp4";
  const uniqueName = `${Date.now()}-${crypto.randomBytes(5).toString("hex")}-${safeBase}${extension}`;

  const videosDir = path.join(getUploadsRoot(), "videos");
  await fs.promises.mkdir(videosDir, { recursive: true });

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

    if (receivedBytes > MAX_VIDEO_SIZE && !finished) {
      finished = true;
      req.unpipe(output);
      output.destroy();
      void cleanupPartialFile();

      if (!res.headersSent) {
        res.status(413).json({
          message: "O vídeo deve ter no máximo 500 MB.",
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

  output.on("error", async (error) => {
    if (finished) return;
    finished = true;
    await cleanupPartialFile();
    console.error("Erro ao salvar vídeo:", error);

    if (!res.headersSent) {
      res.status(500).json({
        message: "Não foi possível salvar o vídeo no servidor.",
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
      contentType,
    });
  });

  req.pipe(output);
});

export { router as uploadVideoRoute, getUploadsRoot };
