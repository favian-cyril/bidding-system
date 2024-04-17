'use client'
import { useEffect, useState } from "react";
import { Accordion } from "./ui/accordion";
import CollectionCard from "./CollectionCard";
import { createCollection, deleteCollection, editCollection, getCollections } from "@/app/actions";
import { useInView } from 'react-intersection-observer'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import CollectionDialog from "./CollectionDialog";
import { Button } from "./ui/button";
import { CollectionWithUser } from "@/app/types";
import { toast } from "sonner";

export default function CollectionList({ initialData, initialCursor, userId }: { initialData: CollectionWithUser[], initialCursor: number, userId: number }) {
  const [collections, setCollections] = useState<CollectionWithUser[]>(initialData);
  const [cursor, setCursor] = useState<number>(initialCursor)
  const [hasNextPage, setHasNextPage] = useState<boolean>(true)
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false)
  const [collectionDialog, setCollectionDialog] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selected, setSelected] = useState<CollectionWithUser>()
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

  const handleOpenEditDialog = async (collection: CollectionWithUser) => {
    setCollectionDialog(true)
    setSelected(collection)
    setIsEdit(true)
  }

  const handleShowDialog = async (open: boolean) => {
    setCollectionDialog(open)
    setSelected(undefined)
    setIsEdit(false)
  }

  const handleOpenCreateDialog =async () => {
    setCollectionDialog(true)
  }

  const handleCollectionDialogForm = async (_: any, data: FormData) => {
    let newData
    if (isEdit) {
      newData = await editCollection(data)
    } else {
      newData = await createCollection(data)
    }
    if (newData?.errors) {
      return { errors: newData?.errors }
    }
    if (isEdit) {
      const index = collections.findIndex((val) => val.id === newData.id)
      const newCollection = collections.slice();
      newCollection.splice(index, 1, newData);
      setCollections(newCollection)
      handleShowDialog(false);
      toast.success('Collection created')
    } else {
      const data = await getCollections(undefined, 1);
      setCollections([...data.collections, ...collections])
      handleShowDialog(false);
      toast.success('Collection edited')
    }
  }

  const handleDeleteCollection = async () => {
    if (selected) {
      await deleteCollection(selected.id)
      const newCollection = collections.filter((val) => val.id !== selected.id);
      setCollections(newCollection);
      handleCloseDeleteDialog();
      toast.error('Collection deleted')
    }
  }

  const handleOpenDeleteDialog = (collection: CollectionWithUser) => {
    setSelected(collection);
    setDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setSelected(undefined);
    setDeleteDialog(false);
  }
  
  return (
    <div className="flex flex-col gap-3 w-full pt-2">
      <Button onClick={handleOpenCreateDialog}>Add Collection</Button>
      <Accordion type="single" collapsible className="flex flex-col gap-2">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} handleEdit={() => handleOpenEditDialog(collection)} handleDelete={() => handleOpenDeleteDialog(collection)} user_id={userId} />
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
      <CollectionDialog open={collectionDialog} collection={selected} action={handleCollectionDialogForm} onOpenChange={handleShowDialog} userId={userId} isEdit={isEdit} />
    </div>
  )
}