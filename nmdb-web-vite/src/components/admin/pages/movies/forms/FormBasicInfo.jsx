import DatePickerForForm from "@/components/common/formElements/DatePicker";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { movieCategories, movieColors, movieStatuses } from "../constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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
      <FormControl>
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
      </FormControl>
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
    <div className="min-h-[60vh] ">
      <div className="grid grid-cols-1 gap-2 p-4 px-4 py-2 md:grid-cols-2 md:gap-x-3 md:gap-y-4 lg:grid-cols-6 lg:gap-x-6 lg:gap-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="lg:col-span-3">
              <FormLabel>Name (in english)</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nepaliName"
          render={({ field }) => (
            <FormItem className="lg:col-span-3">
              <FormLabel>Name (in nepali)</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shootingDate"
          render={({ field }) => (
            <FormItem className="lg:col-span-2">
              <FormLabel>Shooting Date</FormLabel>
              <DatePickerForForm field={field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="releaseDate"
          render={({ field }) => (
            <FormItem className="lg:col-span-2">
              <FormLabel>Release Date</FormLabel>
              <DatePickerForForm field={field} disabled={false} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="runtime"
          render={({ field }) => (
            <FormItem className="lg:col-span-2">
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
          name="imageFile"
          render={({ field }) => (
            <FormItem className="lg:col-span-3">
              <FormLabel>Image / Poster</FormLabel>
              <FileInput
                field={field}
                previews={previews}
                setPreviews={setPreviews}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="officialSiteUrl"
          render={({ field }) => (
            <FormItem className="lg:col-span-3">
              <FormLabel>Official Site</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="lg:col-span-2">
              <FormLabel>Movie Category</FormLabel>
              <Select
               {...field}
                name="customCategory"
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {movieCategories.map((category, index) => (
                    <SelectItem
                      key={"movie-category-" + index}
                      value={category.value}
                    >
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="lg:col-span-2">
              <FormLabel>Movie Status</FormLabel>
              <Select
                {...field}
                name="customStatus"
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {movieStatuses.map((status, index) => (
                    <SelectItem
                      key={"movie-status-" + index}
                      value={status.value}
                    >
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="lg:col-span-2">
              <FormLabel>Movie Color</FormLabel>
              <Select
                {...field}
                name="customColor"
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a color profile" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {movieColors.map((color, index) => (
                    <SelectItem
                      key={"movie-color-" + index}
                      value={color.value}
                    >
                      {color.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem className="lg:col-span-2">
              <FormLabel>Budget</FormLabel>
              <div className="relative flex w-full items-center">
                <span className="absolute px-2 text-sm text-muted-foreground">
                  {" "}
                  NRs.{" "}
                </span>
                <FormControl>
                  <Input className="pl-12" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="flimingLocation"
          render={({ field }) => (
            <FormItem className="lg:col-span-3">
              <FormLabel>Fliming Location</FormLabel>
              <FormControl>
                <Input placeholder="Location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className=" hidden lg:visible"></div>
        <FormField
          control={form.control}
          name="fullMovieLink"
          render={({ field }) => (
            <FormItem className="lg:col-span-3">
              <FormLabel>Movie Youtube Url</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="trailerLink"
          render={({ field }) => (
            <FormItem className="lg:col-span-3">
              <FormLabel>Trailer Youtube Url</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tagline"
          render={({ field }) => (
            <FormItem className="flex flex-col lg:col-span-3">
              <FormLabel>Tagline</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tagline"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="oneLiner"
          render={({ field }) => (
            <FormItem className="flex flex-col lg:col-span-3">
              <FormLabel>One Liner</FormLabel>
              <FormControl>
                <Textarea {...field} />
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
