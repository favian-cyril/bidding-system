'use client'
import Link from "next/link";
import CollectionList from "@/components/CollectionList";
import { CollectionWithUser } from "@/app/types";
import { User } from "@prisma/client";
import UsersList from "./UsersList";
import { useState } from "react";

export default function HomePage({ collections, lastCursor, users }: { collections: CollectionWithUser[], lastCursor: number, users: User[] }) {
    const [currentUser, setCurrentUser] = useState<string>(users[0].name);
    const [userId, setUserId] = useState<number>(users[0].id);
    const handleChangeUser = async (id:number, name: string) => {
        setUserId(id)
        setCurrentUser(name)
    }
  return (
    <div>
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-10 z-10">
        <nav className="flex-col w-1/2 gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >Bid Home</Link>
        </nav>
        <nav className="flex w-1/2 justify-end">
            <UsersList users={users} handleChangeUser={handleChangeUser} currentUser={currentUser} />
        </nav>
      </header>
      <main className="container max-w-4xl">
        <CollectionList initialData={collections} initialCursor={lastCursor} userId={userId} />
      </main>
    </div>
  );
}
