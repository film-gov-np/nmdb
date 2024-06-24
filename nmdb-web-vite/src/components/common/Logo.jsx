import { Package2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

const Logo = ({ className, size = "sm", aspect = "square" }) => {
  return (
    <Avatar
      className={cn(
        "flex h-8 w-8 text-center",
        className,
        size === "sm" ? "h-6 w-6" : "",
        aspect === "landscape" ? "aspect-[3/4] h-8 w-12" : "aspect-square",
      )}
    >
      <AvatarImage src={"/emblem_nepal.png"} alt="Logo" />
      <AvatarFallback className="bg-transparent">
        <Package2 className="h-6 w-6" />
      </AvatarFallback>
    </Avatar>
  );
};

export default Logo;
