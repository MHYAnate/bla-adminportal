import { routes } from "../api-routes";
import { ErrorHandler } from "../errorHandler";
import httpService from "../httpService";
import useFetchItem from "../useFetchItem";
import useMutateItem from "../useMutateItem";

export const useGetCustomers = () => {
  const { isLoading, error, data, refetch, setFilter, filter } = useFetchItem({
    queryKey: ["fetchCustomers"],
    queryFn: (queryParams) =>
      httpService.getData(routes.customers(queryParams)),
    // enabled,
    retry: 2,
  });

  return {
    getCustomersIsLoading: isLoading,
    getCustomersData: data?.data || [],
    getCustomersError: ErrorHandler(error),
    refetchCustomers: refetch,
    setCustomersFilter: setFilter,
  };
};

export const useGetCustomerInfo = () => {
  const { isLoading, error, data, refetch, setFilter, filter } = useFetchItem({
    queryKey: ["fetchCustomerInfo"],
    queryFn: (id) => httpService.getData(routes.getCustomerInfo(id)),
    retry: 2,
  });

  return {
    getCustomerInfoIsLoading: isLoading,
    getCustomerInfoData: data?.data?.data || {},
    getCustomerInfoError: ErrorHandler(error),
    refetchCustomerInfo: refetch,
    setCustomerInfoFilter: setFilter,
  };
};

export const useGetCustomerOrderHistory = () => {
  const { isLoading, error, data, refetch, setFilter, filter } = useFetchItem({
    queryKey: ["fetchCustomerOrderHistory"],
    queryFn: (id) => httpService.getData(routes.getCustomerOrderHistory(id)),
    retry: 2,
  });

  return {
    getCustomerOrderHistoryIsLoading: isLoading,
    getCustomerOrderHistoryData: data?.data?.data || {},
    getCustomerOrderHistoryError: ErrorHandler(error),
    refetchCustomerOrderHistoryInfo: refetch,
    setCustomerOrderHistoryFilter: setFilter,
  };
};

// export const useSuspendUser = (handleSuccess) => {
//   const { data, error, isPending, mutateAsync } = useMutateItem({
//     mutationFn: ({ email }) =>
//       httpService.postData({}, routes.suspendUser(email)),
//     onSuccess: (requestParams) => {
//       const resData = requestParams?.data?.result || {};
//       console.log(resData);
//       handleSuccess(resData);
//       showSuccessAlert(resData);
//     },
//     onError: (error) => {
//       showErrorAlert(error?.response?.data?.errorMessages[0]);
//     },
//   });

//   return {
//     suspendUserData: data,
//     suspendUserDataError: ErrorHandler(error),
//     suspendUserIsLoading: isPending,
//     suspendUserPayload: (requestPayload) => mutateAsync(requestPayload),
//   };
// };

// export const useUnsuspendUser = (handleSuccess) => {
//   const { data, error, isPending, mutateAsync } = useMutateItem({
//     mutationFn: ({ email }) =>
//       httpService.postData({}, routes.unSuspendUser(email)),
//     onSuccess: (requestParams) => {
//       const resData = requestParams?.data?.result || {};
//       console.log(resData);
//       handleSuccess(resData);
//       showSuccessAlert(resData);
//     },
//     onError: (error) => {
//       showErrorAlert(error?.response?.data?.errorMessages[0]);
//     },
//   });

//   return {
//     unSuspendUserData: data,
//     unSuspendUserDataError: ErrorHandler(error),
//     unSuspendUserIsLoading: isPending,
//     unSuspendUserPayload: (requestPayload) => mutateAsync(requestPayload),
//   };
// };

// export const useDeleteUser = (handleSuccess) => {
//   const { data, error, isPending, mutateAsync } = useMutateItem({
//     mutationFn: (email) => httpService.deleteData(routes.deleteUser(email)),
//     onSuccess: (requestParams) => {
//       const resData = requestParams?.data?.result || {};
//       handleSuccess(resData);
//       showSuccessAlert(resData);
//     },
//     onError: (error) => {
//       showErrorAlert(error?.response?.data?.errorMessages[0]);
//     },
//   });

//   return {
//     deleteUserData: data,
//     deleteUserDataError: ErrorHandler(error),
//     deleteUserIsLoading: isPending,
//     deleteUserPayload: (requestPayload) => mutateAsync(requestPayload),
//   };
// };
