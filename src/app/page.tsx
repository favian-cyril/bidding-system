import { getCollections, getUsers } from "./actions";
import HomePage from "@/components/HomePage";

export default async function Home() {
  const initialData = await getCollections();
  const usersData = await getUsers()
  
  return (
    <HomePage collections={initialData.collections} lastCursor={initialData.lastCursor} users={usersData.users} />
  );
}
