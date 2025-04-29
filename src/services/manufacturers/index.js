import { showErrorAlert } from "@/lib/utils";
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

export const useGetManufacturerInfo = () => {
  const { isLoading, error, data, refetch, setFilter, filter } = useFetchItem({
    queryKey: ["fetchManufacturerInfo"],
    queryFn: (id) => httpService.getData(routes.getManufacturerInfo(id)),
    retry: 2,
  });

  return {
    getManufacturerInfoIsLoading: isLoading,
    getManufacturerInfoData: data?.data?.data || {},
    getManufacturerInfoError: ErrorHandler(error),
    refetchManufacturerInfo: refetch,
    setManufacturerInfoFilter: setFilter,
  };
};

export const useGetManufacturerProducts = () => {
  const { isLoading, error, data, refetch, setFilter } = useFetchItem({
    queryKey: ["fetchProducts"],
    queryFn: ({ manufacturerId, data }) =>
      httpService.getData(
        routes.manufacturerProducts({ manufacturerId, data })
      ),
    // enabled,
    retry: 2,
  });

  return {
    getManufacturerProductsIsLoading: isLoading,
    getManufacturerProductsData: data?.data || [],
    getManufacturerProductsError: ErrorHandler(error),
    refetchManufacturerProducts: refetch,
    setManufacturerProductsFilter: setFilter,
  };
};

export const useDeleteManufacturerProduct = (handleSuccess) => {
  const { data, error, isPending, mutateAsync } = useMutateItem({
    mutationFn: (id) =>
      httpService.deleteData(routes.deleteManufacturerProduct(id)),
    onSuccess: (requestParams) => {
      const resData = requestParams?.data?.result || {};
      console.log(requestParams);
      handleSuccess(resData);
      //   showSuccessAlert(resData);
    },
    onError: (error) => {
      showErrorAlert("An error occured");
    },
  });

  return {
    deleteProductData: data,
    deleteProductDataError: ErrorHandler(error),
    deleteProductIsLoading: isPending,
    deleteProductPayload: (requestPayload) => mutateAsync(requestPayload),
  };
};

export const useUpdateManufacturerStatus = (handleSuccess) => {
  const { data, error, isPending, mutateAsync } = useMutateItem({
    mutationFn: ({ payload, id }) =>
      httpService.patchData(payload, routes.updateManufacturerStatus(id)),
    onSuccess: (requestParams) => {
      const resData = requestParams?.data?.result || {};
      console.log(requestParams);
      handleSuccess(resData);
      //   showSuccessAlert(resData);
    },
    onError: (error) => {
      showErrorAlert("An error occured");
    },
  });

  return {
    updateManufacturerStatusData: data,
    updateManufacturerStatusError: ErrorHandler(error),
    updateManufacturerStatusIsLoading: isPending,
    updateManufacturerStatusPayload: ({ payload, id }) =>
      mutateAsync({ payload, id }),
  };
};
