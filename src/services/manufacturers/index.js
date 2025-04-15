import { routes } from "../api-routes";
import { ErrorHandler } from "../errorHandler";
import httpService from "../httpService";
import useFetchItem from "../useFetchItem";
import useMutateItem from "../useMutateItem";

export const useGetManufacturers = () => {
  const { isLoading, error, data, refetch, setFilter } = useFetchItem({
    queryKey: ["fetchManufacturers"],
    queryFn: (queryParams) =>
      httpService.getData(routes.manufacturers(queryParams)),
    // enabled,
    retry: 2,
  });

  return {
    getManufacturersIsLoading: isLoading,
    getManufacturersData: data?.data || [],
    getManufacturersError: ErrorHandler(error),
    refetchManufacturers: refetch,
    setManufacturersFilter: setFilter,
  };
};
