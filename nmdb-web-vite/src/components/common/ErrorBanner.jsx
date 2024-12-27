import { CircleAlert } from "lucide-react";

const ErrorBanner = () => {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-8 shadow-sm">
      <div className="flex flex-col items-center gap-1 text-center">
        <CircleAlert className="h-10 w-10" />
        <h3 className="text-2xl font-bold tracking-tight">
          Something went wrong.
        </h3>
        <p className="text-sm text-muted-foreground">Please try again later.</p>
      </div>
    </div>
  );
};

export default ErrorBanner;
