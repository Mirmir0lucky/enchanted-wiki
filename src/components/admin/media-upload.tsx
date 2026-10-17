"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MediaItem } from "@/lib/media";

export function MediaUpload({
  onUploaded,
  refreshOnUpload = false,
}: {
  onUploaded?: (item: MediaItem) => void;
  refreshOnUpload?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await response.json()) as { url?: string; name?: string; error?: string };
      if (!response.ok || !data.url || !data.name) {
        throw new Error(data.error ?? "Upload failed.");
      }
      onUploaded?.({ name: data.name, url: data.url, size: file.size });
      if (refreshOnUpload) router.refresh();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
      />
      <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => inputRef.current?.click()}>
        {busy ? <Loader2 className="animate-spin" /> : <Upload />}
        Upload
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
