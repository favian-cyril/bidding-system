'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useCallback, useEffect, useState } from "react";
import { acceptBid, createBid, deleteBid, getBids, updateBid } from "@/app/actions";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import BidDialog from "./BidDialog";
import { toast } from "sonner";
import { BidWithUser } from "@/app/types";

export default function BidsTable({ collection_id, currentUser, user_id }: { collection_id: number, currentUser: boolean, user_id: number }) {
  const [data, setData] = useState<BidWithUser[]>([])
  const [deleteBidDialog, setDeleteBidDialog] = useState<boolean>(false)
  const [selected, setSelected] = useState<BidWithUser>()
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [openBidDialog, setOpenBidDialog] = useState(false);

  const fetchBids = useCallback(
    async () => {
      const res = await getBids(collection_id)
      setData(res.bids)
    },
    [collection_id],
  )
  
  useEffect(() => {
    if (collection_id) {
      fetchBids()
    }
  }, [collection_id, fetchBids])

  
  const handleShowDeleteDialog = (bid: BidWithUser) => {
    setSelected(bid)
    setDeleteBidDialog(true);
  }

  const handleCloseDeleteDialog = () => {
    setSelected(undefined);
    setDeleteBidDialog(false);
  }

  const handleDeleteBid = async () => {
    if (selected) {
      await deleteBid(selected.id, selected.collection_id);
      await fetchBids()
      handleCloseDeleteDialog()
      toast.error('Bid Deleted')
    }
  }

  const handleAcceptBid = async (bid: BidWithUser) => {
    await acceptBid(bid.collection_id, bid.id);
    await fetchBids();
    toast.success('Bid Accepted')
  }

  const handleOpenEditBid = async (bid: BidWithUser) => {
    setOpenBidDialog(true);
    setSelected(bid);
    setIsEdit(true);
  }

  const handleOpenCreateBid = async () => {
    setOpenBidDialog(true);
  }

  const handleShowDialog = async (open: boolean) => {
    setOpenBidDialog(open);
    setIsEdit(false);
    setSelected(undefined)
  }

  const handleBidDialogForm = async (_:any, data: FormData) => {
    let newData;
    if (isEdit) {
      newData = await updateBid(data, collection_id)
    } else {
      newData = await createBid(data, collection_id, user_id);
    }
    if (newData?.errors) {
      return { errors: newData?.errors }
    }
    await fetchBids()
    handleShowDialog(false)
    toast.success(isEdit ? 'Bid Edited' : 'Bid Created')
  }
  
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((bid) => (
            <TableRow key={bid.id}>
              <TableCell>{bid.user.name}</TableCell>
              <TableCell className="hidden md:table-cell">{bid.user.email}</TableCell>
              <TableCell className="hidden md:table-cell">{bid.status}</TableCell>
              <TableCell className="text-right">${bid.price}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="outline">Action</Button></DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {currentUser && <DropdownMenuItem onClick={() => handleAcceptBid(bid)}>Accept</DropdownMenuItem>}
                    <DropdownMenuItem onClick={() => handleOpenEditBid(bid)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShowDeleteDialog(bid)}>Cancel</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {data.length === 0 && <div className="py-4 w-full text-center">There are no bids yet.</div>}
      {!currentUser && <div className="flex w-full justify-end mt-2">
        <Button className="w-24" onClick={handleOpenCreateBid}>Bid</Button>
      </div>}
      <AlertDialog open={deleteBidDialog} onOpenChange={setDeleteBidDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the bid from the collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBid}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <BidDialog open={openBidDialog} onOpenChange={handleShowDialog} bid={selected} action={handleBidDialogForm} isEdit={isEdit} />
    </div>
  )
}