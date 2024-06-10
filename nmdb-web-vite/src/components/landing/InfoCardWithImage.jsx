import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import Image from "../common/Image";

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
  ...props
}) => {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="overflow-hidden rounded-md">
        <NavLink to={navigateTo}>
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
        </NavLink>
      </div>
      <div className="space-y-2 text-sm">
        <NavLink to={navigateTo}>
          <h3 className="font-medium leading-none hover:text-primary/80">
            {title}
          </h3>
        </NavLink>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
};

export default InfoCardWithImage;
