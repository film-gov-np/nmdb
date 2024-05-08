import { DataTableAdvancedServerControlled } from "@/components/ui/custom/data-table/data-table-advanced-server-controlled";
import { Paths } from "@/constants/routePaths";
import { columns } from "./DataColumns";
import { ApiPaths } from "@/constants/apiPaths";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/helpers/axiosSetup";
const getCategories = async () => {
  let apiPath = ApiPaths.Path_Flim_RoleCategories;
  const apiResponse = await axiosInstance
    .get(apiPath)
    .then((response) => {
      console.log("api-response-categories", response.data);
      return response.data;
    })
    .catch((err) => console.error(err));
  return apiResponse;
};
const Role = () => {
  const queryClient = useQueryClient();
  const getFromCache = (key) => {
    return queryClient.getQueryData([key]);
  };
  const categories = useQuery({
    queryKey: ["flimRoleCategories"],
    queryFn: async () => {
      const cache = getFromCache(`flimRoleCategories`);
      if (cache) {
        console.log("cachedCategories", cache);
        return cache;
      }
      return await getCategories();
    },
    keepPreviousData: true,
  });
  const facetedFilters = [{
    name: "categoryName",
    title: "Category",
    accessorKey: "CategoryIds",
    isMultiSelector: true,
    filters: categories?.data?.map((categroy) => (
      { value: categroy.id, label: categroy.categoryName }
    )) || []
  },];
  return (
    <main className="flex flex-1 flex-col gap-2 overflow-auto p-4 lg:gap-4 lg:p-6">
      <DataTableAdvancedServerControlled
        apiPath={ApiPaths.Path_FilmRoles}
        columns={columns}
        facetedFilters={facetedFilters}
        nameLabel="role"
        queryKey="datatable-flim-roles"
        addNewPath={Paths.Route_Admin_Role_Add}
        pageSizeOptions={[10, 25, 50, 75, 100]}
      />
    </main>
  );
};

export default Role;
