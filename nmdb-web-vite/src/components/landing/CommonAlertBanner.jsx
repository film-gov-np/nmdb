import { cn } from "@/lib/utils";
import { AlertCircle, CircleDashed } from "lucide-react";
const ViewType = {
  error: "Error",
  banner: "Banner",
  loader: "Loader",
  noData: "NoData",
};
const CommonAlertBanner = ({
  message = "Something went wrong. Please try again later.",
  type = "Loader",
  label = "Loading",
}) => {
  return (
    <div className="flex min-h-[28rem] flex-1 items-center justify-center rounded-lg border border-dashed p-6 shadow-sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2">
          {type === ViewType.error && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle
                  className={cn(
                    "h-6 w-6",
                    (type = ViewType.error ? "text-red-500" : ""),
                  )}
                />
                <h3 className="text-2xl font-bold tracking-tight">Error</h3>
              </div>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
          )}
          {type === ViewType.noData && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle
                  className={cn(
                    "h-6 w-6",
                    (type = ViewType.error ? "text-orange-500" : ""),
                  )}
                />
                <h3 className="text-2xl font-bold tracking-tight">No Result</h3>
              </div>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
          )}
          {type === ViewType.loader && (
            <div className="flex gap-2">
              <CircleDashed className="h-6 w-6 animate-[spin_3s_linear_infinite]" />
              {label}...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommonAlertBanner;
