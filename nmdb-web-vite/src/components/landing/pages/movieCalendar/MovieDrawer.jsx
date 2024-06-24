import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Image from "@/components/common/Image";
import { format } from "date-fns";
import { Paths } from "@/constants/routePaths";
import { NavLink } from "react-router-dom";

export function MovieDrawer({ open, onOpenChange, movie }) {
  //   const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{movie.name}</DialogTitle>
            <DialogDescription>{movie.nepaliName}</DialogDescription>
          </DialogHeader>
          <MovieDetails details={movie} />
          <DialogFooter>
            <NavLink to={Paths.Route_Movies + "/" + movie.id}>
              <Button type="button">View Movie</Button>
            </NavLink>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{movie.name}</DrawerTitle>
          <DrawerDescription>{movie.nepaliName}</DrawerDescription>
        </DrawerHeader>
        <MovieDetails className="px-4" details={movie} />
        <DrawerFooter className="flex flex-row justify-evenly pt-2">
          <NavLink to={Paths.Route_Movies + "/" + movie.id}>
            <Button type="button">View Movie</Button>
          </NavLink>
          <DrawerClose>Cancel</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function MovieDetails({ className, details }) {
  return (
    <div className={cn("grid items-start gap-4", className)}>
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-3">
          <Image src={details.thumbnailPhotoUrl} className={"rounded-md"} />
        </div>
        <div className="col-span-3 flex flex-col ">
          <div className="">
            <Label>Status</Label> {details.status}
          </div>
          <div className="">
            <Label>Release Date</Label> {format(details.releaseDate, "PPP")}
          </div>
        </div>
      </div>
    </div>
  );
}
