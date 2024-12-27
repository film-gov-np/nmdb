import { Input } from "@/components/ui/input";
import Image from "../Image";

export const FileInput = ({ field, previews, setPreviews }) => {
  const handleUploadedFile = (event) => {
    const files = event.target.files;
    const urlImages = [];
    for (const key in files) {
      if (typeof files[key] !== "object") continue;
      urlImages.push(URL.createObjectURL(files[key]));
    }
    setPreviews((prev) => ({ ...prev, [field.name]: urlImages }));
  };

  return (
    <div>
      <Input
        type="file"
        onChange={(e) => {
          field.onChange(e.target.files);
          handleUploadedFile(e);
        }}
      />
      {previews[field.name] && previews[field.name].length > 0 && (
        <>
          {previews[field.name].map((preview, index) => (
            <div
              key={"image-preview-" + [field.name] + index}
              className="mt-2 flex flex-wrap gap-2"
            >
              <div
                className="max-h-[320px] flex-grow basis-1/3"
                key={"thumbnailMovie" + index}
              >
                <Image
                  className="h-full w-full rounded-md  object-cover"
                  src={preview}
                  alt={"Picture" + index}
                />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
