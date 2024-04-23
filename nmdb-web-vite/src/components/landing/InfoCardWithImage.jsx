import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

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
  const handleImageLoadError = (e) => {
    e.target?.src && (e.target.src = "/placeholder.svg");
  };

  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="overflow-hidden rounded-md">
        <NavLink to={navigateTo}>
          <img
            src={
              imgPath
                ? "https://image.tmdb.org/t/p/w500/" + imgPath
                : "/placeholder.svg"
            }
            alt={title || data.name}
            width={width}
            height={height}
            className={cn(
              "dark:brightness-80 h-auto w-full object-cover transition-all hover:scale-105",
              aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square",
            )}
            onError={handleImageLoadError}
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
