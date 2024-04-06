import { DeleteTasksDialog } from "./DeleteTasksDialog";

const DataTableToolbarActions = ({ table }) => {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteTasksDialog
          selectedData={table.getFilteredSelectedRowModel().rows}
          onSuccess={() => table.toggleAllPageRowsSelected(false)}
        />
      ) : null}
    </div>
  );
};
export default DataTableToolbarActions;
