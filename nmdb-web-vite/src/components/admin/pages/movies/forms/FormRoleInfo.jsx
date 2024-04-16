import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import React, { useState } from "react";
import MultipleSelectorWithList from "../MultipleSelectionWithList";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useFieldArray } from "react-hook-form";
import { Trash } from "lucide-react";

const roles = [
  {
    value: "director",
    label: "Director",
  },
  {
    value: "actress",
    label: "Actress",
  },
  {
    value: "producer",
    label: "Producer",
  },
  {
    value: "cameraman",
    label: "Cameraman",
  },
  {
    value: "action-director",
    label: "Action Director",
  },
  {
    value: "actor",
    label: "Actor",
  },
];

const FormRoleInfo = ({ form }) => {
  const [open, setOpen] = useState(false);
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "crew_and_roles",
  });
  return (
    <div className="min-h-[60vh]">
      <div className="grid grid-cols-1 gap-4 px-4 py-2 md:grid-cols-2">
        {fields.map((formFields, index) => (
          <fieldset
            key={formFields.id}
            className="grid h-fit grid-cols-1 gap-2 rounded-lg border p-4"
          >
            <legend className="text-md -ml-1 px-1 font-medium capitalize text-muted-foreground">
              {Object.keys(formFields)[0]}
            </legend>
            <Button
              variant="outline"
              size="icon"
              className="-mt-10 ml-auto h-7 w-7"
              onClick={() => remove(index)}
            >
              <Trash className="h-4 w-4" />
            </Button>
            <FormField
              control={form.control}
              name={`crew_and_roles.${index}.${Object.keys(formFields)[0]}`}
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>{formFields.role}</FormLabel> */}
                  <FormControl>
                    <MultipleSelectorWithList
                      value={field.value}
                      onChange={field.onChange}
                      triggerOnSearch={true}
                      minSearchTrigger={3}
                      apiPath="https://api.slingacademy.com/v1/sample-data/users?limit=100&search="
                      keyValue="id"
                      keyLabel="first_name"
                      imgLabel="profile_picture"
                      placeholder="Begin typing to search crew member..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
        ))}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-[150px] justify-start"
            >
              <>+ Add a role</>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" side="right" align="start">
            <Command>
              <CommandInput placeholder="Change status..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {roles.map((role) => (
                    <CommandItem
                      key={role.value}
                      value={role.value}
                      onSelect={(value) => {
                        append({
                          [value]: [],
                        });
                        delete roles[roles.indexOf(role)];
                        setOpen(false);
                      }}
                    >
                      <span>{role.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default FormRoleInfo;
