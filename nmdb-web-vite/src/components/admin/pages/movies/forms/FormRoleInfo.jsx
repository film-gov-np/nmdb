import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import MultipleSelectorWithList from "@/components/ui/custom/multiple-selector/MultipleSelectionWithList";
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
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/helpers/axiosSetup";

const getCrewFlimRoles = async (apiPath) => {
  const apiResponse = await axiosInstance
    .get(apiPath)
    .then((response) => {
      return response.data;
    })
    .catch((err) => console.error(err));
  return apiResponse.data;
};

const FormRoleInfo = ({ form }) => {
  const [open, setOpen] = useState(false);
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "crewRoles",
  });
  const { isLoading, data, isError, isFetching, isPreviousData, error } =
    useQuery({
      queryKey: ["FlimRolesforCrews"],
      queryFn: () => getCrewFlimRoles("/film-roles?RetrieveAll=true"),
      keepPreviousData: true,
    });
  if (isLoading || isFetching) return "loading";
  if (error) return "error";
  const roles = data.items;
  return (
    <div className="min-h-[60vh]">
      <div className="grid grid-cols-1 gap-2 p-4 px-4 py-2 md:grid-cols-2 md:gap-x-3 md:gap-y-4 lg:gap-x-6 lg:gap-y-8">
        {fields.map((formField, index) => (
          <fieldset
            key={formField.roleId}
            className="grid h-fit grid-cols-1 gap-2 rounded-lg border p-4"
          >
            <legend className="text-md -ml-1 px-1 font-medium capitalize text-muted-foreground">
              {formField.roleName}
            </legend>
            <Button
              variant="outline"
              size="icon"
              className="-mt-10 ml-auto h-7 w-7 border-red-300 text-red-300 hover:text-red-400"
              onClick={() => remove(index)}
            >
              <Trash className="h-4 w-4" />
            </Button>
            <FormField
              control={form.control}
              name={`crewRoles.${index}.crews`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultipleSelectorWithList
                      value={field.value}
                      onChange={field.onChange}
                      triggerOnSearch={true}
                      minSearchTrigger={3}
                      apiPath="crews?RetrieveAll=true&SearchKeyword="
                      keyValue="id"
                      keyLabel="name"
                      showAvatar = {true}
                      imgLabel="profilePhoto"
                      extraLabel="nepaliName"
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
                      key={"movie-role-" + role.id}
                      value={role.id}
                      onSelect={(value) => {
                        setOpen(false);
                        append({
                          roleId: role.id,
                          roleName: role.roleName,
                          crews: [],
                        });
                        delete roles[roles.indexOf(role)];
                      }}
                    >
                      <span>{role.roleName}</span>
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
