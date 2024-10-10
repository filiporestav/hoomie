"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Camera } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function Avatar({
  uid,
  url,
  size,
  onUpload,
}: {
  uid: string | null;
  url: string | null;
  size: number;
  onUpload: (url: string) => void;
}) {
  const supabase = createClient();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from("avatars")
          .download(path);
        if (error) throw error;
        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
      } catch (error) {
        console.log("Error when loading image:", error);
      }
    }

    if (url) downloadImage(url);
  }, [url, supabase]);

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${uid}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      onUpload(filePath);

      const { data } = await supabase.storage
        .from("avatars")
        .download(filePath);

      if (data) {
        const newUrl = URL.createObjectURL(data);
        setAvatarUrl(newUrl);
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col items-center space-y-4">
        <Tooltip>
          <TooltipTrigger>
            <div
              className="relative group"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              {avatarUrl ? (
                <div className="relative">
                  <Image
                    width={size}
                    height={size}
                    src={avatarUrl}
                    alt="Avatar"
                    className={cn(
                      "rounded-full object-cover transition-all duration-300",
                      hover && "filter brightness-75"
                    )}
                  />
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center rounded-full transition-opacity duration-300",
                      hover ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
              ) : (
                <div
                  className={cn(
                    "bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold transition-all duration-300",
                    hover && "bg-primary/20"
                  )}
                  style={{ width: size, height: size }}
                >
                  {uid?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ändra profilbild</p>
          </TooltipContent>
        </Tooltip>

        <div className="relative">
          <Button
            variant="outline"
            className={cn(
              "relative w-40 transition-all duration-300",
              uploading && "bg-primary/5"
            )}
            disabled={uploading}
          >
            <input
              type="file"
              id="single"
              accept="image/*"
              onChange={uploadAvatar}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className="flex items-center justify-center">
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Laddar upp...</span>
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  <span>Välj profilbild</span>
                </>
              )}
            </div>
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
