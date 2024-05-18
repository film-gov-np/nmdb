import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray } from "react-hook-form";
import MultipleSelectorWithList from "../MultipleSelectionWithList";
import { Trash, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { TrashIcon } from "@radix-ui/react-icons"

const FormTheatreInfo = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "theatres",
  });
  return (
    <div className="min-h-[60vh]">
      <div className="grid grid-cols-1 gap-4 px-4 py-2">
        <fieldset className="grid h-fit grid-cols-1 gap-2 rounded-lg border p-4">
          <legend className="text-md -ml-1 px-1 font-medium capitalize text-muted-foreground">
            Theater
          </legend>
          {fields.map((formFields, index) => (
            <div
              key={formFields.id}
              className="mb-2 grid gap-4 rounded-md border border-input px-4 py-2 md:grid-cols-[5fr,2fr] lg:grid-cols-[7fr,3fr,1fr]"
            >
              <FormField
                control={form.control}
                name={`theatres.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theater Name</FormLabel>
                    <FormControl>
                      <MultipleSelectorWithList
                        value={field.value}
                        onChange={field.onChange}
                        triggerOnSearch={true}
                        minSearchTrigger={3}
                        apiPath="theatres?SearchKeyword="
                        keyValue="id"
                        keyLabel="name"
                        placeholder="Begin typing to search for theater..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`theatres.${index}.showingDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Showing Date</FormLabel>
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
              <div className="lg:mt-9">
                
                <Button
                  variant="outline-destructive"
                  size="sm"
                  className="ml-auto mr-2 h-8 "
                  onClick={() => remove(index)}
                >
                  <TrashIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </fieldset>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => {
            append({
              name: "",
              showingDate: "",
            });
          }}
          className="w-[150px] justify-start"
        >
          <>+ Add more Theater</>
        </Button>
      </div>
    </div>
  );
};

export default FormTheatreInfo;
