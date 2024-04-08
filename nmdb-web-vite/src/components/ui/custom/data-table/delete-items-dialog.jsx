
import { TrashIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useTransition } from "react"
import { useToast } from "../../use-toast"

export function DeleteItemsDialog({
  selectedData,
  onSuccess,
  showTrigger = true,
  ...props}
) {
  const [isDeletePending, startDeleteTransition] = useTransition()
  const {toast} = useToast()

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button
            variant="outlineDestructive"
            size="sm"
            className="ml-auto mr-2 hidden h-8 lg:flex" 
          >
            <TrashIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            Delete ({selectedData.length})
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-medium">{selectedData.length}</span>
            {selectedData.length === 1 ? " item" : " items"} from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              aria-label="Delete selected rows"
              variant="destructive"
              onClick={() => {
                startDeleteTransition(() => {
                  toast({
                    title: "You submitted the following values:",
                    description: (
                      <pre className="mt-2 w-[440px] max-h-96 rounded-md bg-slate-950 p-4">
                        <code className="text-white">{JSON.stringify(selectedData, null, 2)}</code>
                      </pre>
                    ),
                  });
                  
                  onSuccess()
                })
              }}
              disabled={isDeletePending}
            >
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}