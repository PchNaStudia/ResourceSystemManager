import { useSuspenseQuery } from "@tanstack/react-query";
import { getGroup } from "@client/api/resourcesGroup";

const useService = (id: number) => {
  const { data, isPending, error, isSuccess } = useSuspenseQuery({
    queryKey: ["get-group", id],
    queryFn: () => getGroup(id),
  });

  return {
    data,
    isPending,
    error,
    isSuccess,
  } as const;
};

export default useService;
