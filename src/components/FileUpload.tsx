"use client";
import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";

export const FileUpload = () => {
  const router = useRouter();
  const { toast } = useToast();

  return (
    <UploadDropzone<OurFileRouter>
      className="bg-white ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300"
      endpoint="pdfUploader"
      content={{
        allowedContent({ isUploading }) {
          if (isUploading)
            return (
              <>
                <p className="mt-2 text-sm text-slate-400 animate-pulse">
                  Spilling Tea to GPT...
                </p>
              </>
            );
        },
      }}
      onClientUploadComplete={(res) => {
        if (res && res[0] && res[0].serverData) {
          const { chatId } = res[0].serverData;
          if (chatId) {
            toast({
              title: "Chat created!",
              description: `Chat session created.`,
            });
            router.push(`/chat/${chatId}`);
          } else {
            toast({
              variant: "destructive",
              title: "Error creating chat!",
              description: "The chat ID was not returned from the server.",
            });
          }
        }
      }}
      onUploadError={(error: Error) => {
        toast({
          variant: "destructive",
          title: `ERROR! ${error.message}`,
        });
      }}
      onUploadBegin={(name) => {
        console.log("Uploading: ", name);
      }}
    />
  );
};
