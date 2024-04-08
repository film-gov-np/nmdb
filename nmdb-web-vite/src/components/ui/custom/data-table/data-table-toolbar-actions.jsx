import { DeleteItemsDialog } from "./delete-items-dialog";

const DataTableToolbarActions = ({ table }) => {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteItemsDialog
          selectedData={table.getFilteredSelectedRowModel().rows}
          onSuccess={() => table.toggleAllPageRowsSelected(false)}
        />
      ) : null}
    </div>
  );
};
export default DataTableToolbarActions;
