import { Collection } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import BidsTable from "./BidsTable";
import { MouseEventHandler } from "react";

export default function CollectionCard({ collection, user_id, handleEdit, handleDelete }: { collection: Collection, user_id?: number, handleEdit: MouseEventHandler<HTMLButtonElement>, handleDelete: MouseEventHandler<HTMLButtonElement> }) {
  const currentUser = true;
  return (
    <AccordionItem value={collection.id.toString()} className="w-full">
      <Card key={collection.id}>
        <AccordionTrigger className="pr-4">
          <CardHeader className="text-left">
            <CardTitle>{collection.name}</CardTitle>
            <CardDescription>{collection.description}</CardDescription>
          </CardHeader>
        </AccordionTrigger>
        <AccordionContent>
          <CardContent>
            <div className="flex flex-row gap-2 w-full justify-between mb-5">
              <div className="flex flex-col">
                <span className="text-xl font-bold">${collection.price}</span>
                <span>Stock: {collection.stocks}</span>
              </div>
              {currentUser ? (<div className="flex gap-2">
                <Button onClick={handleEdit}>Edit</Button>
                <Button variant="destructive" onClick={handleDelete}>Delete</Button>
              </div>) : (
                <Button>Bid</Button>
              )}
            </div>
            <BidsTable collection_id={collection.id} currentUser={true} />
          </CardContent>
        </AccordionContent>
      </Card>
    </AccordionItem>
  )
}