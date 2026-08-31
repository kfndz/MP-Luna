import { useRef, useState } from "react";
import {
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  Play,
  Star,
  Trash2,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthService } from "@/services/AuthService";

import ImageUpload from "./ImageUpload";

type Props = {
  images: string[];
  videos: string[];
  onImagesChange: (images: string[]) => void;
  onVideosChange: (videos: string[]) => void;
};

const MAX_VIDEO_SIZE = 500 * 1024 * 1024;
const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v",
  "video/ogg",
];

type UploadResponse = {
  url?: string;
  message?: string;
};

export default function ProductMediaUpload({
  images,
  videos,
  onImagesChange,
  onVideosChange,
}: Props) {
  const [videoUrl, setVideoUrl] = useState("");
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [videoUploadError, setVideoUploadError] = useState("");
  const videoInputRef = useRef<HTMLInputElement>(null);

  function addImage(value: string) {
    const normalized = value.trim();
    if (!normalized || images.includes(normalized)) return;
    onImagesChange([...images, normalized]);
  }

  function removeImage(index: number) {
    onImagesChange(images.filter((_, currentIndex) => currentIndex !== index));
  }

  function makeMainImage(index: number) {
    if (index === 0) return;
    const next = [...images];
    const [selected] = next.splice(index, 1);
    next.unshift(selected);
    onImagesChange(next);
  }

  function addVideo() {
    const normalized = videoUrl.trim();
    if (!normalized || videos.includes(normalized)) return;
    onVideosChange([...videos, normalized]);
    setVideoUrl("");
  }

  function removeVideo(index: number) {
    onVideosChange(videos.filter((_, currentIndex) => currentIndex !== index));
  }

  async function uploadVideoFile(file: File) {
    setVideoUploadError("");

    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      setVideoUploadError(
        "Formato não suportado. Use MP4, WEBM, MOV, M4V ou OGG.",
      );
      return;
    }

    if (file.size > MAX_VIDEO_SIZE) {
      setVideoUploadError("O vídeo deve ter no máximo 500 MB.");
      return;
    }

    const adminToken = AuthService.getToken();

    if (!adminToken) {
      setVideoUploadError("Sua sessão expirou. Entre novamente no painel.");
      return;
    }

    setIsUploadingVideo(true);
    setVideoUploadProgress(0);

    try {
      const uploadedUrl = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/uploads-video");
        xhr.setRequestHeader("Authorization", `Bearer ${adminToken}`);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.setRequestHeader("X-File-Name", encodeURIComponent(file.name));

        xhr.upload.onprogress = (event) => {
          if (!event.lengthComputable) return;
          setVideoUploadProgress(
            Math.min(99, Math.round((event.loaded / event.total) * 100)),
          );
        };

        xhr.onerror = () => {
          reject(new Error("Falha de conexão durante o envio do vídeo."));
        };

        xhr.onload = () => {
          let data: UploadResponse = {};

          try {
            data = JSON.parse(xhr.responseText || "{}") as UploadResponse;
          } catch {
            // Mantém a mensagem padrão abaixo.
          }

          if (xhr.status >= 200 && xhr.status < 300 && data.url) {
            resolve(data.url);
            return;
          }

          reject(
            new Error(
              data.message ||
                "Não foi possível enviar o vídeo para o servidor.",
            ),
          );
        };

        xhr.send(file);
      });

      if (!videos.includes(uploadedUrl)) {
        onVideosChange([...videos, uploadedUrl]);
      }

      setVideoUploadProgress(100);

      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Erro ao enviar vídeo:", error);
      setVideoUploadError(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar o vídeo.",
      );
    } finally {
      setIsUploadingVideo(false);
    }
  }

  function handleVideoFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (file) void uploadVideoFile(file);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div>
          <h4 className="flex items-center gap-2 font-semibold text-foreground">
            <ImageIcon className="h-4 w-4 text-accent" />
            Fotos do produto
          </h4>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Adicione quantas fotos precisar. A primeira foto será usada como capa do produto.
          </p>
        </div>

        {images.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="overflow-hidden rounded-2xl border border-border bg-muted/30"
              >
                <div className="relative aspect-square bg-muted">
                  <img
                    src={image}
                    alt={`Foto ${index + 1} do produto`}
                    className="h-full w-full object-contain p-2"
                  />
                  {index === 0 && (
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                      <Star className="h-3 w-3 fill-current" />
                      Capa
                    </span>
                  )}
                </div>

                <div className="flex gap-2 p-2">
                  {index !== 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => makeMainImage(index)}
                    >
                      Usar como capa
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={index === 0 ? "w-full" : "px-3"}
                    onClick={() => removeImage(index)}
                    aria-label={`Remover foto ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                    {index === 0 && <span className="ml-2">Remover</span>}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-2xl border border-border bg-muted/20 p-3 sm:p-4">
          <p className="mb-3 text-sm font-medium text-foreground">Adicionar outra foto</p>
          <ImageUpload value="" onChange={addImage} />
        </div>
      </div>

      <div className="space-y-4 border-t border-border pt-5">
        <div>
          <h4 className="flex items-center gap-2 font-semibold text-foreground">
            <Play className="h-4 w-4 text-accent" />
            Vídeos do produto
          </h4>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Envie um vídeo do computador ou cole um link do YouTube, Vimeo, MP4 ou WEBM. Você pode adicionar mais de um.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-muted/20 p-3 sm:p-4">
          <p className="mb-3 text-sm font-medium text-foreground">
            Enviar vídeo do computador
          </p>

          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/x-m4v,video/ogg"
            onChange={handleVideoFileSelect}
            className="hidden"
          />

          <button
            type="button"
            disabled={isUploadingVideo}
            onClick={() => videoInputRef.current?.click()}
            className="flex min-h-32 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border px-6 py-6 text-center transition hover:border-accent/50 hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploadingVideo ? (
              <Loader2 className="mb-3 h-8 w-8 animate-spin text-accent" />
            ) : (
              <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
            )}
            <span className="text-sm font-medium text-foreground">
              {isUploadingVideo
                ? `Enviando vídeo... ${videoUploadProgress}%`
                : "Clique para escolher um vídeo"}
            </span>
            <span className="mt-1 text-xs text-muted-foreground">
              MP4, WEBM, MOV, M4V ou OGG • até 500 MB
            </span>
          </button>

          {isUploadingVideo && (
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${videoUploadProgress}%` }}
              />
            </div>
          )}

          {videoUploadError && (
            <p className="mt-3 text-sm text-destructive">{videoUploadError}</p>
          )}
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-foreground">
            Ou adicionar por link
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={videoUrl}
                onChange={(event) => setVideoUrl(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addVideo();
                  }
                }}
                placeholder="https://youtube.com/watch?v=..."
                className="pl-9"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addVideo}
              disabled={!videoUrl.trim()}
            >
              Adicionar vídeo
            </Button>
          </div>
        </div>

        {videos.length > 0 && (
          <div className="space-y-2">
            {videos.map((video, index) => (
              <div
                key={`${video}-${index}`}
                className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Play className="h-4 w-4" />
                </div>
                <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                  {video}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="px-2"
                  onClick={() => removeVideo(index)}
                  aria-label={`Remover vídeo ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
