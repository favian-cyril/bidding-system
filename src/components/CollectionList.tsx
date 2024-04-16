'use client'
import { Collection } from "@prisma/client";
import { useEffect, useState } from "react";
import { Accordion } from "./ui/accordion";
import CollectionCard from "./CollectionCard";
import { deleteCollection, editCollection, getCollections } from "@/app/actions";
import { useInView } from 'react-intersection-observer'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import CollectionDialog from "./CollectionDialog";

export default function CollectionList({ initialData, initialCursor }: { initialData: Collection[], initialCursor: number }) {
  const [collections, setCollections] = useState<Collection[]>(initialData);
  const [cursor, setCursor] = useState<number>(initialCursor)
  const [hasNextPage, setHasNextPage] = useState<boolean>(true)
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false)
  const [editDialog, setEditDialog] = useState<boolean>(false)
  const [selected, setSelected] = useState<Collection>()
  const { ref, inView } = useInView()

  useEffect(() => {
    const loadMoreCollections = async () => {
      const data = await getCollections(cursor);
      setCollections([...collections, ...data.collections]);
      setCursor(data.lastCursor);
      setHasNextPage(data.hasNextPage);
    }
    if (inView && hasNextPage) {
      loadMoreCollections()
    }
  }, [collections, cursor, hasNextPage, inView])

  const handleOpenEditDialog = async (collection: Collection) => {
    setEditDialog(true)
    setSelected(collection)
  }

  const handleCloseEditDialog = async () => {
    setSelected(undefined)
    setEditDialog(false)
  }

  const handleSuccessEdit = async (prevState: any, data: FormData) => {
    const newData = await editCollection(prevState, data)
    handleCloseEditDialog();
    const index = collections.findIndex((val) => val.id === newData.id)
    const newCollection = collections.slice();
    newCollection.splice(index, 1, newData);
    setCollections(newCollection)
  }

  const handleDeleteCollection = async () => {
    if (selected) {
      await deleteCollection(selected.id)
      const newCollection = collections.filter((val) => val.id !== selected.id);
      setCollections(newCollection);
      handleCloseDeleteDialog();
    }
  }

  const handleOpenDeleteDialog = (collection: Collection) => {
    setSelected(collection);
    setDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setSelected(undefined);
    setDeleteDialog(false);
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <Accordion type="multiple" className="flex flex-col gap-2">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} handleEdit={() => handleOpenEditDialog(collection)} handleDelete={() => handleOpenDeleteDialog(collection)} />
        ))}
      </Accordion>
      {hasNextPage && <div className="text-center px-2" ref={ref}>
        Loading...
      </div>}
      <AlertDialog open={deleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCollection}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <CollectionDialog open={editDialog} collection={selected} action={handleSuccessEdit} onOpenChange={setEditDialog} />
    </div>
  )
}