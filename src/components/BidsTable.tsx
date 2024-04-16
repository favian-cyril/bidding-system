'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useCallback, useEffect, useState } from "react";
import { Bid } from "@prisma/client";
import { acceptBid, deleteBid, getBids } from "@/app/actions";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";

type BidItem = Bid & { user: { name: string, email: string }};

export default function BidsTable({ collection_id, currentUser }: { collection_id: number, currentUser: boolean }) {
  const [data, setData] = useState<BidItem[]>([])
  const [deleteBidDialog, setDeleteBidDialog] = useState<boolean>(false)
  const [selected, setSelected] = useState<BidItem>()

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

  
  const handleShowDeleteDialog = (bid: BidItem) => {
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
    }
  }

  const handleAcceptBid = async (bid: BidItem) => {
    await acceptBid(bid.collection_id, bid.id);
    await fetchBids()
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
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShowDeleteDialog(bid)}>Cancel</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
    </div>
  )
}