import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/custom/data-table/data-table-column-header";
import { extractInitials } from "@/lib/utils";
import { Check, LoaderCircle, QrCode } from "lucide-react";
import { useState } from "react";
import { ApiPaths } from "@/constants/apiPaths";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import QrCodeGenerator from "@/components/common/QrCodeGenerator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/helpers/axiosSetup";
import { useToast } from "@/components/ui/use-toast";

export const labels = [];

export const facetedFilters = [];

function DataTableRowActions({ row }) {
  const [showApproveAlert, setShowApproveAlert] = useState(false);
  const [showCelebCardDialog, setShowCelebCardDialog] = useState(false);
  const [invalidateCardReuest, setInvalidateCardReuest] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const approveCardRequest = async (id) => {
    setIsLoading(true);
    const apiPath = `${ApiPaths.Path_CardRequest}/${id}/approve`;
    const { data } = await axiosInstance({
      method: "patch",
      url: apiPath,
    })
      .then((response) => {
        return response.data;
      })
      .catch((err) => console.error(err));
    return data;
  };

  const mutateCardRequest = useMutation({
    mutationFn: approveCardRequest,
    onSuccess: async (data, variables, context) => {
      setInvalidateCardReuest(true);
      setShowCelebCardDialog(true);
      toast({
        description: "Successfully completed the card approval.",
        duration: 5000,
      });
    },
    onError: (error, variables, context) => {
      toast({
        variant: "destructive",
        description: "Something went wrong.Please try again.",
        duration: 5000,
      });
    },
    onSettled: (data, error, variables, context) => {
      setIsLoading(false);
      // queryClient.invalidateQueries("datatable-card-request");
    },
  });

  return (
    <div className="flex justify-center gap-2">
      <AlertDialog open={showApproveAlert} onOpenChange={setShowApproveAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm</AlertDialogTitle>
            <AlertDialogDescription>
              This action will approve the card request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={() => {
                  mutateCardRequest.mutate(row.original.id);
                }}
                variant="outline"
              >
                Continue
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <QrCodeGenerator
        celebrity={row.original.crew}
        open={showCelebCardDialog}
        onOpenChange={(open) => {
          setShowCelebCardDialog(open);
          if (invalidateCardReuest)
            queryClient.invalidateQueries(["datatable-card-request"]);
        }}
        showTrigger={false}
      />
      {row.original.isApproved ? (
        <Button onClick={() => setShowCelebCardDialog(true)} variant="outline">
          <QrCode className="mr-2 h-4 w-4" />
          <span>Show Card</span>
        </Button>
      ) : (
        <Button
          disabled={isLoading}
          onClick={() => setShowApproveAlert(true)}
          variant="outline"
        >
          {isLoading ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Check className="mr-2 h-4 w-4" />
          )}
          <span>Approve</span>
        </Button>
      )}
    </div>
  );
}

export const columns = [
  {
    accessorKey: "crew",
    meta: "Crew",
    header: ({ column }) => (
      <DataTableColumnHeader className="ps-12" column={column} title="Crew" />
    ),
    cell: ({ row }) => {
      const currentCrew = row.getValue("crew");
      return (
        <div className="flex items-center justify-start space-x-4">
          <Avatar className="flex h-8 w-8 text-center">
            <AvatarImage src={currentCrew.profilePhotoUrl} alt="Avatar" />
            <AvatarFallback className="bg-muted-foreground/90 text-xs font-semibold text-input">
              {extractInitials(currentCrew.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-2">
            {currentCrew.name}
            {currentCrew.email && (
              <span className="text-xs text-muted-foreground">
                {currentCrew.email}
              </span>
            )}
          </div>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "approvedDate",
    meta: "Approved Date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Approved Date" />
    ),
    cell: ({ row }) => (
      <div className="">
        {row.getValue("approvedDate") &&
          format(row.getValue("approvedDate"), "PPP p")}
      </div>
    ),
    enableSorting: false,
    // enableGlobalFilter: true,
  },
  {
    accessorKey: "isApproved",
    meta: "Is Approved",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Is Approved" />
    ),
    cell: ({ row }) => {
      let isApproved = row.getValue("isApproved");
      return (
        <Badge
          variant={isApproved ? "secondary" : "destructive"}
          className="px-4 "
        >
          {isApproved ? "Yes" : "No"}
        </Badge>
      );
    },
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
