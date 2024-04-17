'use client'
import { Bid } from "@prisma/client";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useFormState } from "react-dom";

export default function BidDialog({
  open,
  bid,
  action,
  onOpenChange,
  isEdit = false
}: {
  open: boolean,
  bid?: Bid,
  action: (prevState: any, data: FormData) => Promise<any>,
  onOpenChange: (open: boolean) => void,
  isEdit?: boolean
}) {
  const [state, formAction] = useFormState(action, bid)
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Bid' : 'Bid on collection'}</DialogTitle>
          </DialogHeader>
          <form action={formAction}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <input type="hidden" name="id" value={bid?.id} />
                <Label htmlFor="username" className="text-right">
                  Price
                </Label>
                <Input
                  name="price"
                  type="number"
                  defaultValue={bid?.price || ''}
                  className="col-span-3"
                />
                <p className="col-span-4 text-red-500 text-sm">{state?.errors?.price?.[0]}</p>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{isEdit ? 'Edit Bid' : 'Save'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  )
}