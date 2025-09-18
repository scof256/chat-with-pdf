import { createUploadthing, type FileRouter } from "uploadthing/next";
import { currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadPdfIntoPinecone } from "@/lib/pinecone";

const f = createUploadthing();

const getUser = async () => await currentUser();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  pdfUploader: f({
    pdf: { maxFileCount: 1, maxFileSize: "8MB" },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await getUser();

      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      try {
        await loadPdfIntoPinecone(file.key, file.url);

        const chat_id = await db
          .insert(chats)
          .values({
            fileKey: file.key,
            pdfName: file.name,
            pdfUrl: file.url,
            userId: metadata.userId,
          })
          .returning({
            insertedId: chats.id,
          });

        return { chatId: chat_id[0].insertedId };
      } catch (error) {
        console.error("Error in onUploadComplete:", error);
        throw new Error("Failed to process PDF and create chat.");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
