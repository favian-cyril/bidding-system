import Image from "next/image";
import { getCollections } from "./actions";
import CollectionList from "@/components/CollectionList";

export default async function Home() {
  const initialData = await getCollections();
  return (
    <main className="container max-w-4xl">
      <CollectionList initialData={initialData.collections} initialCursor={initialData.lastCursor} />
    </main>
  );
}
