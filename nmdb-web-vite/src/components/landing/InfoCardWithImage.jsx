import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import Image from "../common/Image";
import { CircleCheck } from "lucide-react";
import { CheckCircledIcon } from "@radix-ui/react-icons";

const InfoCardWithImage = ({
  data,
  title,
  imgPath,
  description,
  navigateTo,
  aspectRatio = "portrait",
  width,
  height,
  className,
  isVerifiedProfile = false,
  ...props
}) => {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="overflow-hidden rounded-md">
        <NavLink to={navigateTo} className="relative">
          <Image
            src={imgPath}
            alt={title || data.name}
            width={width}
            height={height}
            className={cn(
              "transition-all hover:scale-105",
              aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square",
            )}
          />
          {isVerifiedProfile && <CheckCircledIcon className="absolute top-1 left-1 text-secondary h-4 w-4 stro"/>}
        </NavLink>
      </div>
      <div className="space-y-2 text-sm">
        <NavLink to={navigateTo} className="flex justify-evenly">
          <h3 className="font-medium leading-none hover:text-primary/80">
            {title}
          </h3>
          {isVerifiedProfile && <CheckCircledIcon className="text-secondary h-5 w-5"/>}
        </NavLink>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
};

export default InfoCardWithImage;
