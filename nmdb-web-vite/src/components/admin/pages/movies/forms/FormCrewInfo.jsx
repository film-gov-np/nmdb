import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axiosInstance from "@/helpers/axiosSetup";
import { useQueries } from "@tanstack/react-query";
import MultipleSelectorWithList from "@/components/ui/custom/multiple-selector/MultipleSelectionWithList";
import useCachedData from "@/hooks/useCachedData";

const FormCrewInfo = ({ form }) => {
  const { getFromCache } = useCachedData();
  const getHelperData = async (apiPath, queryKey) => {
    const { cache } = getFromCache([queryKey]);
    if (cache) {
      console.log("cached-data", cache);
      return cache;
    }
    const apiResponse = await axiosInstance
      .get(apiPath)
      .then((response) => {
        console.log("api-response", response.data);
        return response.data;
      })
      .catch((err) => console.error(err));
    return apiResponse.data;
  };
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
  return (
    <div className="min-h-[60vh]">
      <div className="grid grid-cols-1 gap-2 p-4 px-4 py-2 md:grid-cols-2 md:gap-x-3 md:gap-y-4 lg:gap-x-6 lg:gap-y-8">
        <FormField
          control={form.control}
          name="genres"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genre</FormLabel>
              <FormControl>
                <MultipleSelectorWithList
                  {...field}
                  value={field.value}
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
          name="languages"
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
          name="productionHouses"
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
