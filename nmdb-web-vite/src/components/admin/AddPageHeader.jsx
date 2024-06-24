import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { renderModes } from "@/constants/general";

const AddPageHeader = ({ label, pathTo, renderMode = "details" }) => {
  let infoText = "view the";
  if (renderMode === renderModes.Render_Mode_Create) infoText = "add a new";
  else if (renderMode === renderModes.Render_Mode_Edit) infoText = "edit the";
  return (
    <>
      <div className="flex items-center justify-start gap-6">
        <NavLink to={pathTo}>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </NavLink>
        <div>
          <h2 className="text-3xl font-bold capitalize tracking-tight text-primary">
            {label}
          </h2>
          <p className="text-sm text-primary/80">
            Use the form below to {infoText} {label}.
          </p>
        </div>
      </div>
      <Separator />
    </>
  );
};

export default AddPageHeader;
