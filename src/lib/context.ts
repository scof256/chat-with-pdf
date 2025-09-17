import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  const pinecone = new Pinecone();
  const index = pinecone.Index("chat-with-pdf");
  try {
    const fileKeyWithoutAsci = convertToAscii(fileKey);
    const queryResult = await index.query({
      topK: 5,
      vector: embeddings,
      filter: { fileKey: { $eq: fileKeyWithoutAsci } },
      includeMetadata: true,
    });
    console.log("queryRes=>", queryResult);
    return queryResult.matches || [];
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error;
  }
}

export async function getContext(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddings(query);
  console.log("queryEmbeddings", queryEmbeddings);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);
  console.log("matched", matches);
  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  );

  type Metadata = {
    text: string;
    pageNumber: number;
  };
  let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);

  console.log("matching docs=>", docs);
  return docs.join("\n").substring(0, 3000);
}
