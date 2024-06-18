
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
import { useToast } from "@/components/ui/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@/helpers/axiosSetup"


const deleteItems = async ({apiBasePath, itemsToDelete}) => {
  const itemId = itemsToDelete[0].original.id 
  let apiPath = `${apiBasePath}/${itemId}`;
  const { data } = await axiosInstance
  .delete(apiPath)
  .then((response) => {
    return response;
  })
  .catch((err) => console.error(err));
  return data;
}

export function DeleteItemsDialog({
  selectedData,
  onSuccess,
  showTrigger = true,
  apiBasePath,
  ...props}
) {
  const [isDeletePending, startDeleteTransition] = useTransition()
  const queryClient = useQueryClient()
  const {toast} = useToast()

  const {mutate} = useMutation(
    {
      mutationFn: deleteItems,
      onSuccess: (data, variables, context) => {
        toast({description:"Successfully deleted from the sysetm."})
      },
      onError: (error, variables, context) => {
        toast({description:"Something went wrong.Please try again."})
      },
      onSettled: (data, error, variables, context) => {
        queryClient.invalidateQueries('delete');
      }
      
  })

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button
            variant="outline-destructive"
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
                  mutate({apiBasePath, itemsToDelete:selectedData})
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