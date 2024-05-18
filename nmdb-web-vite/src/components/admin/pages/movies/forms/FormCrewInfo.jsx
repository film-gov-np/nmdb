import MultipleSelector from "@/components/ui/custom/multiple-selector/multiple-selector";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axiosInstance from "@/helpers/axiosSetup";
import { useQueries, useQuery } from "@tanstack/react-query";
import MultipleSelectorWithList from "../MultipleSelectionWithList";

const getHelperData = async (apiPath, queryKey) => {
  const apiResponse = await axiosInstance
    .get(apiPath)
    .then((response) => {
      console.log("api-response", response.data);
      return response.data;
    })
    .catch((err) => console.error(err));
  return apiResponse.data;
};

const FormCrewInfo = ({ form }) => {
  const helperData = useQueries({
    queries: [
      {
        queryKey: ["MovieGenres"],
        queryFn: () => getHelperData(`movies/GetAllGenres`, "MovieGenres"),
      },
      {
        queryKey: ["MovieLanguages"],
        queryFn: () =>
          getHelperData(`movies/GetAllLanguages`, "MovieLanguages"),
      },
    ],
  });
  const isLoading = helperData.some((query) => query.isLoading);
  const isError = helperData.some((query) => query.error);
  if (isLoading) return "loading";
  if (isError) return "error";
  const genres = helperData[0].data;
  const languages = helperData[1].data;
  console.log(helperData);
  return (
    <div className="min-h-[60vh]">
      <div className="grid grid-cols-1 gap-2 p-4 px-4 py-2 md:grid-cols-2 md:gap-x-3 md:gap-y-4 lg:gap-x-6 lg:gap-y-8">
        <FormField
          control={form.control}
          name="genre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genre</FormLabel>
              <FormControl>
                <MultipleSelectorWithList
                  {...field}
                  triggerOnSearch={false}
                  defaultOptions={genres}
                  placeholder="Select movie genres"
                  keyValue="id"
                  keyLabel="name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <MultipleSelectorWithList
                  {...field}
                  triggerOnSearch={false}
                  defaultOptions={languages}
                  placeholder="Select movie languages"
                  keyValue="id"
                  keyLabel="name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="studio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Studio</FormLabel>
              <FormControl>
                <MultipleSelectorWithList
                  value={field.value}
                  onChange={field.onChange}
                  triggerOnSearch={true}
                  minSearchTrigger={3}
                  apiPath="production-house?SearchKeyword="
                  keyValue="id"
                  keyLabel="name"
                  // imgLabel="profile_picture"
                  placeholder="Begin typing to search studios..."
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

export default FormCrewInfo;
