// app/admin/components/ImageUploadField.tsx
"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";

type ImageUploadFieldProps = {
  value: string;
  width: number;
  height: number;
  onChange: (next: { image: string; imageWidth: number; imageHeight: number }) => void;
};

/** Reads the natural size of a picked file so next/image gets correct dimensions. */
function readImageSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: 0, height: 0 });
    };
    image.src = objectUrl;
  });
}

export function ImageUploadField({ value, width, height, onChange }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const uploadFile = async (file: File) => {
    setError(null);
    setUploading(true);

    try {
      const size = await readImageSize(file);
      const body = new FormData();
      body.append("file", file);

      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "خطا در آپلود تصویر.");
        return;
      }

      onChange({
        image: data.url,
        imageWidth: size.width || width,
        imageHeight: size.height || height,
      });
    } catch {
      // Handled and shown inline; logging would surface Next's dev error overlay.
      setError("خطا در ارتباط با سرور هنگام آپلود تصویر.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) void uploadFile(file);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-neutral-700">تصویر شاخص</label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition ${
          dragging ? "border-[#8f1d1d] bg-[#8f1d1d]/5" : "border-neutral-300 bg-gray-50"
        }`}
      >
        {value ? (
          <div className="flex w-full flex-col items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="پیش‌نمایش تصویر"
              className="max-h-52 w-auto rounded-lg border border-neutral-200 object-contain"
            />
            <p dir="ltr" className="break-all font-mono text-xs text-neutral-500">
              {value}
              {width && height ? ` · ${width}×${height}` : ""}
            </p>
          </div>
        ) : (
          <>
            <ImagePlus className="h-8 w-8 text-neutral-400" />
            <p className="text-sm text-neutral-600">
              تصویر را اینجا رها کنید یا از دکمه زیر انتخاب کنید
            </p>
            <p className="text-xs text-neutral-400">JPG, PNG, WebP, GIF, AVIF — حداکثر ۵ مگابایت</p>
          </>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-lg bg-[#8f1d1d] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#6b1616] disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            {uploading ? "در حال آپلود..." : value ? "تغییر تصویر" : "انتخاب تصویر"}
          </button>

          {value && !uploading && (
            <button
              type="button"
              onClick={() => onChange({ image: "", imageWidth: width, imageHeight: height })}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-gray-300"
            >
              <Trash2 className="h-4 w-4" />
              حذف
            </button>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-500">
          آدرس تصویر (در صورت نیاز دستی وارد کنید)
        </label>
        <input
          type="text"
          dir="ltr"
          value={value}
          onChange={(e) => onChange({ image: e.target.value, imageWidth: width, imageHeight: height })}
          className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-left font-mono text-sm focus:border-[#8f1d1d] focus:outline-none"
          placeholder="/home/blog/image.jpg"
        />
        <p className="mt-1 text-xs text-neutral-500">
          تصاویر آپلودشده در پوشه public/home/blog/ ذخیره می‌شوند.
        </p>
      </div>
    </div>
  );
}
