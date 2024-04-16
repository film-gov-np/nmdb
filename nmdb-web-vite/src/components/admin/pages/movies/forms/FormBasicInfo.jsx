import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

const FileInput = ({ field, previews, setPreviews }) => {
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
        // value={value}
        multiple
        onChange={(e) => {
          // setValue(e.target.value);
          field.onChange(e.target.files);
          handleUploadedFile(e);
        }}
      />
      <div className="mt-2 flex flex-wrap gap-2">
        {previews.map((preview, index) => (
          <div
            className="max-h-[320px] flex-grow basis-1/3"
            key={"thumbnailMovie" + index}
          >
            <img
              className="h-full w-full rounded-md  object-cover"
              src={preview}
              alt={"Picture" + index}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const FormBasicInfo = ({ form, previews, setPreviews }) => {
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
          name="runtime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Runtime</FormLabel>
              <FormControl>
                <Input placeholder="Runtime" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date_shooting"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shooting Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date_release"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Release Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image / Poster</FormLabel>
              <FormControl>
                <FileInput
                  field={field}
                  previews={previews}
                  setPreviews={setPreviews}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default FormBasicInfo;
