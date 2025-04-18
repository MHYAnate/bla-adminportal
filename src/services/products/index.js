import { showErrorAlert } from "@/lib/utils";
import { routes } from "../api-routes";
import { ErrorHandler } from "../errorHandler";
import httpService from "../httpService";
import useFetchItem from "../useFetchItem";
import useMutateItem from "../useMutateItem";

export const useGetProducts = () => {
  const { isLoading, error, data, refetch, setFilter } = useFetchItem({
    queryKey: ["fetchProducts"],
    queryFn: (queryParams) => httpService.getData(routes.products(queryParams)),
    // enabled,
    retry: 2,
  });

  return {
    getPRoductsIsLoading: isLoading,
    getProductsData: data?.data || [],
    getProductsError: ErrorHandler(error),
    refetchProducts: refetch,
    setProductsFilter: setFilter,
  };
};

export const useDeleteProduct = (handleSuccess) => {
  const { data, error, isPending, mutateAsync } = useMutateItem({
    mutationFn: (id) => httpService.deleteData(routes.deleteProducts(id)),
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
