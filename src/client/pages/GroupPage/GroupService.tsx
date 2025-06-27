import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import {
  changeReservationStatus,
  createReservation,
  createResource,
  getGroup,
  getGroupReservations,
  getGroupResources,
  getGroupTypes,
} from "@client/api/resourcesGroup";
import { z } from "zod";
import { CreateResourceSchema, ReserveSchema } from "@common/ApiTypes";

const useService = (id: number) => {
  const {
    data: dataGetGroup,
    isPending: isPendingGetGroup,
    error: errorGetGroup,
    isSuccess: isSuccessGetGroup,
  } = useSuspenseQuery({
    queryKey: ["get-group", id],
    queryFn: () => getGroup(id),
  });

  const {
    data: dataGetReservations,
    isPending: isPendingGetReservations,
    error: errorGetReservations,
    isSuccess: isSuccessGetReservations,
    refetch: refetchReservations,
  } = useSuspenseQuery({
    queryKey: ["get-group-reservations", id],
    queryFn: () => getGroupReservations(id),
  });

  const {
    data: dataGetTypes,
    isPending: isPendingGetTypes,
    error: errorGetTypes,
    isSuccess: isSuccessGetTypes,
  } = useSuspenseQuery({
    queryKey: ["get-group-types", id],
    queryFn: () => getGroupTypes(id),
  });

  const {
    data: dataGetResources,
    isPending: isPendingGetResources,
    error: errorGetResources,
    isSuccess: isSuccessGetResources,
    refetch: refetchResources,
  } = useSuspenseQuery({
    queryKey: ["get-group-resources", id],
    queryFn: () => getGroupResources(id),
  });

  const changeReservation = useMutation({
    mutationFn: changeReservationStatus,
    onSuccess: () => refetchReservations(),
  });

  const approveReservation = (rId: number) => {
    changeReservation.mutate({
      groupId: id,
      reservationId: rId,
      status: "CONFIRMED",
    });
  };
  const rejectReservation = (rId: number) => {
    changeReservation.mutate({
      groupId: id,
      reservationId: rId,
      status: "REJECTED",
    });
  };
  const cancelReservation = (rId: number) => {
    changeReservation.mutate({
      groupId: id,
      reservationId: rId,
      status: "CANCELED",
    });
  };

  const resourceMutation = useMutation({
    mutationFn: createResource,
    onSuccess: () => refetchResources(),
  });

  const createResourceFn = (r: z.infer<typeof CreateResourceSchema>) => {
    resourceMutation.mutate({ groupId: id, ...r });
  };

  const reservationCreateMutation = useMutation({
    mutationFn: createReservation,
    onSuccess: () => refetchReservations(),
  });

  const createReservationFn = (r: z.infer<typeof ReserveSchema>) => {
    reservationCreateMutation.mutate({ groupId: id, ...r });
  };

  return {
    data: {
      group: dataGetGroup.resourceGroups,
      access: dataGetGroup.resourcesAccess,
      reservations: dataGetReservations,
      types: dataGetTypes,
      resources: dataGetResources,
    },
    approveReservation,
    rejectReservation,
    cancelReservation,
    createResource: createResourceFn,
    createReservation: createReservationFn,
    isPending:
      isPendingGetGroup ||
      isPendingGetReservations ||
      isPendingGetTypes ||
      isPendingGetResources ||
      changeReservation.isPending,
    error:
      errorGetGroup ??
      errorGetReservations ??
      errorGetTypes ??
      errorGetResources ??
      changeReservation.error,
    isSuccess:
      isSuccessGetGroup &&
      isSuccessGetReservations &&
      isSuccessGetTypes &&
      isSuccessGetResources &&
      changeReservation.isSuccess,
  } as const;
};

export default useService;
