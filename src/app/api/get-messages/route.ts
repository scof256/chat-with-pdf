import { db } from "@/lib/db";
import { messages, chats } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export const runtime = "edge";

export const POST = async (req: Request) => {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { chatId } = await req.json();

  // Verify that the user owns the chat
  const _chats = await db
    .select()
    .from(chats)
    .where(and(eq(chats.id, chatId), eq(chats.userId, userId)));

  if (_chats.length !== 1) {
    return new NextResponse("Chat not found", { status: 404 });
  }

  const _messages = await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId));

  return NextResponse.json(_messages);
};
