import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadPdfIntoPinecone } from "@/lib/pinecone";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { utapi } from "uploadthing/server";

// /api/create-chat
export async function POST(req: Request, res: Response) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { file_key, file_name } = body;

    const fileUrlResponse = await utapi.getFileUrls(file_key);
    if (!fileUrlResponse || fileUrlResponse.length === 0) {
        return NextResponse.json({ error: "file not found" }, { status: 404 });
    }
    const file_url = fileUrlResponse[0].url;

    await loadPdfIntoPinecone(file_key, file_url);

    const chat_id = await db
      .insert(chats)
      .values({
        fileKey: file_key,
        pdfName: file_name,
        pdfUrl: file_url,
        userId,
      })
      .returning({
        insertedId: chats.id,
      });

    return NextResponse.json(
      {
        chat_id: chat_id[0].insertedId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
