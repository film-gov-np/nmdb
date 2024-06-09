import { DataTableAdvancedServerControlled } from "@/components/ui/custom/data-table/data-table-advanced-server-controlled";
import { ApiPaths } from "@/constants/apiPaths";
import { Paths } from "@/constants/routePaths";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { columns } from "./DataColumns";

const getAwards = async () => {
  let apiPath = ApiPaths.Path_Awards;
  const apiResponse = await axiosInstance
    .get(apiPath)
    .then((response) => {
      return response.data;
    })
    .catch((err) => console.error(err));
  return apiResponse;
};

const Awards = () => {
  const queryClient = useQueryClient();
  const getFromCache = (key) => {
    return queryClient.getQueryData([key]);
  };
  const categories = useQuery({
    queryKey: ["awards"],
    queryFn: async () => {
      const cache = getFromCache(`awards`);
      if (cache && cache.length > 0) {
        return cache;
      }
      return await getAwards();
    },
    keepPreviousData: true,
  });

  const facetedFilters = [];
  if (categories.status === "success" && categories?.data?.length > 0) {
    // facetedFilters.push({
    //   name: "categoryName",
    //   title: "Category",
    //   accessorKey: "CategoryIds",
    //   isMultiSelector: true,
    //   filters:
    //     categories?.data?.map((categroy) => ({
    //       value: categroy.id,
    //       label: categroy.categoryName,
    //     })) || [],
    // });
  };

  return (
    <main className="flex flex-1 flex-col gap-2 overflow-auto p-4 lg:gap-4 lg:p-6">
      <DataTableAdvancedServerControlled
        apiPath={ApiPaths.Path_Awards}
        columns={columns}
        facetedFilters={facetedFilters}
        nameLabel="awards"
        queryKey="datatable-awards"
        addNewPath={Paths.Route_Admin_Awards_Add}
        pageSizeOptions={[10, 25, 50, 75, 100]}
      />
    </main>
  );
};

export default Awards;
