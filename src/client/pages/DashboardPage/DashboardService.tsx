// @client/pages/DashboardPage/GroupsService.ts
import { useSuspenseQuery } from "@tanstack/react-query";
import { getUserGroups } from "@client/api/resourcesGroup";
import { getUserReservations } from "@client/api/session";

const useGroupsService = () => {
  const {
    data: groupData,
    isPending: PendingGrp,
    error: errorGrp,
    isSuccess: isSuccessGrp,
  } = useSuspenseQuery({
    queryKey: ["user-groups"],
    queryFn: getUserGroups,
  });
  const {
    data: reservationData,
    isPending: PendingRes,
    error: errorRes,
    isSuccess: isSuccessRes,
  } = useSuspenseQuery({
    queryKey: ["get-reservations"],
    queryFn: getUserReservations,
  });

  return {
    data: {
      groupData,
      reservationData,
    },
    isPending: PendingGrp || PendingRes,
    error: errorGrp ?? errorRes,
    isSuccess: isSuccessGrp || isSuccessRes,
  } as const;
};

export default useGroupsService;
