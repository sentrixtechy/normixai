"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FileSearch } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentViewerProps {
  file: File | null;
  className?: string;
}

export function DocumentViewer({ file, className }: DocumentViewerProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setObjectUrl(null);
    }
  }, [file]);

  if (!file || !objectUrl) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-full w-full text-muted-foreground", className)}>
        <FileSearch className="h-14 w-14 mb-4 text-primary/30" />
        <span className="text-sm font-bold uppercase tracking-widest opacity-50">No Document</span>
      </div>
    );
  }

  const isImage = file.type.includes("image");
  const isPdf = file.type === "application/pdf";

  return (
    <div className={cn("relative h-full w-full flex items-center justify-center overflow-hidden", className)}>
      {isImage && (
        <div className="relative h-full w-full flex items-center justify-center p-4">
          {/* using unoptimized Image or img tag for local dynamic blob url is fine */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={objectUrl} 
            alt="Source document preview" 
            className="max-h-full max-w-full object-contain"
          />
        </div>
      )}
      {isPdf && (
        <iframe
          src={`${objectUrl}#toolbar=0`}
          className="h-full w-full border-0"
          title="PDF Document Preview"
        />
      )}
      {!isImage && !isPdf && (
        <div className="flex flex-col items-center justify-center h-full w-full text-muted-foreground">
          <FileSearch className="h-14 w-14 mb-4 text-primary/30" />
          <span className="text-sm font-bold uppercase tracking-widest opacity-50">{file.name}</span>
          <span className="text-xs opacity-50 mt-2">Preview not available</span>
        </div>
      )}
    </div>
  );
}
