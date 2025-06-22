import { useSuspenseQuery } from "@tanstack/react-query";
import { getUserReservations } from "@client/api/session";

const useService = () => {
  const { data, isPending, error, isSuccess } = useSuspenseQuery({
    queryKey: ["get-reservations"],
    queryFn: getUserReservations,
  });

  return {
    data,
    isPending,
    error,
    isSuccess,
  } as const;
};

export default useService;
