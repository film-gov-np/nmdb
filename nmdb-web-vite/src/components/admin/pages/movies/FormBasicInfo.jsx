import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const FileInput = ({ field }) => {
  const [value, setValue] = useState("");
  const [previews, setPreviews] = useState([]);

  const handleUploadedFile = (event) => {
    const files = event.target.files;
    const urlImages = [];
    for (const key in files) {
      if (typeof files[key] !== "object") continue;
      urlImages.push(URL.createObjectURL(files[key]));
    }

    setPreviews(urlImages);
  };
  return (
    <div>
      <Input
        type="file"
        value={value}
        multiple
        onChange={(e) => {
          setValue(e.target.value);
          field.onChange(e.target.files);
          handleUploadedFile(e);
        }}
      />
      <div className="flex flex-wrap gap-2 mt-2">
        {previews.map((preview, index) => (
       
              <div className="flex-grow basis-1/3 max-h-[320px]">
                <img className="h-full w-full object-cover  rounded-md" src={preview} alt={"Picture"+index} />
              </div>
 
        ))}
      </div>
    </div>
  );
};

const FormBasicInfo = ({ form }) => {
  return (
    <div className=" min-h-[60vh] ">
      <div className="grid grid-cols-1 gap-4 px-4 py-2 md:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name(in english)</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name_nepali"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name(in nepali)</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name(in nepali)</FormLabel>
              <FormControl>
                <FileInput field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FileInput name="picture" control={form.control} /> */}
      </div>
    </div>
  );
};

export default FormBasicInfo;
