import { PlusCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ListPageHeader = ({label, pathTo}) => {
  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight capitalize text-primary">
           {label}
          </h2>
          <p className="text-sm text-primary/80">
            List of all the {label}
          </p>
        </div>
        <NavLink
          to={
            pathTo
          }
          className={cn(buttonVariants({ variant: "default" }), "capitalize")}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add {label}
        </NavLink>
      </div>
      <Separator />
    </>
  );
};

export default ListPageHeader;
