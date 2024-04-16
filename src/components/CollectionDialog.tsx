'use client'
import { Collection } from "@prisma/client";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useFormState, useFormStatus } from "react-dom";

export default function CollectionDialog({ open, collection, action, onOpenChange }: { open: boolean, collection?: Collection, action: (prevState: any, data: FormData) => Promise<any>, onOpenChange: (open: boolean) => void }) {
  const { pending } = useFormStatus()
  const [state, formAction] = useFormState(action, collection)
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>
          <form action={formAction}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <input type="hidden" name="id" value={collection?.id} />
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  name="name"
                  defaultValue={collection?.name || ''}
                  className="col-span-3"
                />
                <p className="col-span-4 text-red-500 text-sm">{state?.errors?.name[0]}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Description
                </Label>
                <Input
                  name="description"
                  defaultValue={collection?.description || ''}
                  className="col-span-3"
                />
                <p className="col-span-4 text-red-500 text-sm">{state?.errors?.description[0]}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Price
                </Label>
                <Input
                  name="price"
                  type="number"
                  defaultValue={collection?.price || ''}
                  className="col-span-3"
                />
                <p className="col-span-4 text-red-500 text-sm">{state?.errors?.price[0]}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Stock
                </Label>
                <Input
                  name="stock"
                  type="number"
                  defaultValue={collection?.stocks || ''}
                  className="col-span-3"
                />
                <p className="col-span-4 text-red-500 text-sm">{state?.errors?.stock[0]}</p>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={pending}>Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  )
}