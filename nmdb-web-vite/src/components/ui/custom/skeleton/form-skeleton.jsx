import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export function FormSkeleton({
  columnCount,
  rowCount = 1,
  repeat = 1,
  cellWidths = ["auto"],
  shrinkZero = false,
}) {
  return (
    <div className="w-full space-y-5 overflow-auto">
      {Array.from({ length: repeat }).map((_, i) => (
        <div key={"main-row"+ i} className="mt-6 rounded-md border">
          <Skeleton className="-mt-4 ml-4 h-8 w-36" />
          <Table>
            <TableBody>
              {Array.from({ length: rowCount }).map((_, i) => (
                <TableRow key={i} className="border-none hover:bg-transparent">
                  {Array.from({ length: columnCount }).map((_, j) => (
                    <TableCell
                      key={j}
                      style={{
                        width: cellWidths[j],
                        minWidth: shrinkZero ? cellWidths[j] : "auto",
                      }}
                    >
                      <div className="space-y-1">
                        <Skeleton className="h-6 w-[50%]" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
      <Skeleton className="m-4 h-10 w-36" />
    </div>
  );
}
