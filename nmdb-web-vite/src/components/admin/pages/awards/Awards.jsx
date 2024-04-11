import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as React from "react";
import { useController, useForm } from "react-hook-form";
const FileInput = ({ field }) => {
  // const { field } = useController({ control, name });
  const [value, setValue] = React.useState("");
  return (
    <Input
      type="file"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        field.onChange(e.target.files);
      }}
    />
  );
};

const Awards = () => {
  const form = useForm();
  const onSubmit = (data) => console.log(data);


  return (
    <div>
<Form {...form}>

      <form onSubmit={form.handleSubmit(onSubmit)}>
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
        
        <input type="submit" />
      </form>
</Form>
    </div>
  );
};

export default Awards;
