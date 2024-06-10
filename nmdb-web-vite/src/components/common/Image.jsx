import { cn } from "@/lib/utils";

const handleImageLoadError = (e) => {
  e.target?.src && (e.target.src = "/placeholder.svg");
};

const Image = ({ className, src, ...props }) => {
  return (
    <img
      className={cn("dark:brightness-80 h-auto w-full object-cover", className)}
      src={src || "/placeholder.svg"}
      {...props}
      onError={handleImageLoadError}
    />
  );
};

export default Image;
