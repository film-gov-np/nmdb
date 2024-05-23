import DatePickerForForm from "@/components/common/formElements/DatePicker";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { movieCensorTypes, movieTypes, movieValidFor } from "../constants";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FormCensorInfo = ({ form }) => {
  return (
    <div className="min-h-[60vh]">
      <div className="grid grid-cols-1 gap-2 p-4 px-4 py-2 md:grid-cols-2 md:gap-x-3 md:gap-y-4 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-8">
        <FormField
          control={form.control}
          name="censor.certificateNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certificate Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="censor.applicationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Application Date</FormLabel>
              <DatePickerForForm field={field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="censor.censoredDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Censored Date</FormLabel>
              <DatePickerForForm field={field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="censor.censorType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Censor Type</FormLabel>
              <Select
                {...field}
                name="customCensorType"
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a censor type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {movieCensorTypes.map((censor, index) => (
                    <SelectItem
                      key={"movie-censor-type-" + index}
                      value={censor.value}
                    >
                      {censor.label}
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
          name="censor.movieType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Movie Type</FormLabel>
              <Select
                {...field}
                name="customMovieType"
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a movie type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {movieTypes.map((movieType, index) => (
                    <SelectItem
                      key={"movie-type-" + index}
                      value={movieType.value}
                    >
                      {movieType.label}
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
          name="censor.validForInYears"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valid For ?</FormLabel>
              <Select
                {...field}
                name="customvalidFor"
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a valid for" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {movieValidFor.map((validFor, index) => (
                    <SelectItem
                      key={"movie-valid-for-" + index}
                      value={validFor.value}
                    >
                      {validFor.label}
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
          name="censor.reelLength"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reel Length</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="censor.reelSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reel Size</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="censor.movieLength"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Movie Length</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="censor.description"
          render={({ field }) => (
            <FormItem className="col-span-3 flex flex-col">
              <FormLabel>Description</FormLabel>
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

export default FormCensorInfo;
