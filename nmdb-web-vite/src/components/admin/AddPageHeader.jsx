import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const AddPageHeader = ({ label, pathTo }) => {
  return (
    <>
      <div className="flex items-center justify-start gap-6">
        <NavLink to={pathTo}>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </NavLink>
        <div>
          <h2 className="text-3xl font-bold capitalize tracking-tight">
            {label}
          </h2>
          <p className="text-sm text-muted-foreground">
            Use the form below to add a new {label}.
          </p>
        </div>
      </div>
      <Separator />
    </>
  );
};

export default AddPageHeader;
