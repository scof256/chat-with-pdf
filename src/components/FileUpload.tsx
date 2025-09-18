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
      onClientUploadComplete={(res) => {
        // Do something with the response
        console.log("Files: ", res);
        if (!res) {
          toast({
            variant: "destructive",
            title: "Error creating chat!",
          });
          return;
        }
        const { chat_id, chat_name } = res[0].serverData;
        toast({
          title: "Chat created!",
          description: `Chat session created for ${chat_name}`,
        });
        router.push(`/chat/${chat_id}`);
      }}
      onUploadError={(error: Error) => {
        toast({
          variant: "destructive",
          title: `ERROR! ${error.message}`,
        });
      }}
      onUploadBegin={(name) => {
        // Do something once upload begins
        console.log("Uploading: ", name);
      }}
    />
  );
};
