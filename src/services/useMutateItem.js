// useMutateItem.js
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useMutateItem({
  mutationFn,
  onSuccess,
  queryKeys,
  onError,
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload) => mutationFn(payload),
    onSuccess: (res, variables) => {
      if (onSuccess) onSuccess(res, variables);
      if (queryKeys) {
        queryKeys.forEach((query) =>
          queryClient.invalidateQueries({ queryKey: [query] })
        );
      }
    },
    onError: (error, variables) => {
      if (onError) onError(error, variables);
    },
  });

  return {
    data: mutation.data,
    error: mutation.error,
    isPending: mutation.isPending,
    mutateAsync: mutation.mutateAsync,
    mutate: mutation.mutate,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
}
