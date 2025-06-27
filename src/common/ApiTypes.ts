import { z } from "zod";

export const GetUserSchema = z
  .object({
    id: z.string(),
    displayName: z.string(),
    email: z.string(),
    picture: z.string(),
  })
  .strip();

export const UpdateUserSchema = GetUserSchema.omit({ id: true }).partial();

export const UserTypeSchema = GetUserSchema.nullable();

export type UserType = z.infer<typeof UserTypeSchema>;

export const ResourceGroupTypeSchema = z
  .object({
    id: z.number(),
    ownerId: z.string(),
  })
  .strip();

export type ResourceGroupType = z.infer<typeof ResourceGroupTypeSchema>;

export const ResourceAccessSchema = z
  .object({
    userId: z.string(),
    groupId: z.number(),
    create: z.coerce.boolean(),
    update: z.coerce.boolean(),
    delete: z.coerce.boolean(),
    manageAccess: z.coerce.boolean(),
    reserveLevel: z.enum(["NONE", "REQUEST", "RESERVE", "APPROVE"]),
  })
  .strip();

export type ResourceAccess = z.infer<typeof ResourceAccessSchema>;

export const ResourceGroupAccessSchema = z
  .object({
    resourceGroups: ResourceGroupTypeSchema,
    resourcesAccess: ResourceAccessSchema.nullable(),
  })
  .strip();

export type ResourceGroupAccess = z.infer<typeof ResourceGroupAccessSchema>;

export const ResourceGroupAccessListSchema = z.array(ResourceGroupAccessSchema);

export type ResourceGroupAccessList = z.infer<
  typeof ResourceGroupAccessListSchema
>;

export const UpdateResourceGroupSchema = z.object({
  ownerId: z.string(),
});

export const ResourceSchema = z
  .object({
    id: z.number(),
    typeId: z.number(),
    groupId: z.number(),
    label: z.string().nullable(),
    metadata: z.unknown(),
  })
  .strip();

export type Resource = z.infer<typeof ResourceSchema>;

export const ResourceSchemaList = z.array(ResourceSchema);

export const CreateResourceSchema = z.object({
  typeId: z.number(),
  label: z.string().optional(),
  metadata: z.unknown().optional(),
});

export const UpdateResourceSchema = z.object({
  typeId: z.number().optional(),
  label: z.string().optional(),
  metadata: z.unknown().optional(),
});

export const CreateResourceGroupAccessSchema = z.object({
  create: z.coerce.boolean().optional(),
  update: z.coerce.boolean().optional(),
  delete: z.coerce.boolean().optional(),
  manageAccess: z.coerce.boolean().optional(),
  reserveLevel: z.enum(["NONE", "REQUEST", "RESERVE", "APPROVE"]).optional(),
});

export const UpdateResourceGroupAccessSchema = CreateResourceGroupAccessSchema;

export const ReservationSchema = z.object({
  id: z.number().int(),
  resources: z.array(z.number()),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  reason: z.string().nullable(),
  status: z.enum(["REQUESTED", "CONFIRMED", "REJECTED", "CANCELED"]),
});

export const ReserveSchema = z
  .object({
    resources: z.array(z.number()).min(1),
    startTime: z.coerce.date().refine((data) => data > new Date(), {
      message: "Start time must be after now",
    }),
    endTime: z.coerce.date(),
    reason: z.string().nullable(),
    force: z.boolean().default(false),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "Start time must be before end time",
  });

export const ReserveResponseSchema = z.object({
  id: z.coerce.number().int(),
});

export const NoResourcesReservationSchema = ReservationSchema.omit({
  resources: true,
});

export const GetReservationSchema = z.object({
  reservation: NoResourcesReservationSchema,
  resources: z.array(ResourceSchema),
});

export const GetReservationsSchema = z.array(GetReservationSchema);

export const ReservationApprovalEnum = z.enum([
  "CONFIRMED",
  "REJECTED",
  "CANCELED",
]);
export const ReservationApprovalSchema = z.object({
  reserveLevel: ReservationApprovalEnum,
});

export const ResourceTypeCreateSchema = z.object({
  parentId: z.number().nullable(),
  groupId: z.number(),
  name: z.string().min(1),
  shortName: z.string().nullable(),
  metadataSchema: z.any().nullable(),
});

export const ResourceTypeUpdateSchema = z.object({
  parentId: z.number().nullable(),
  name: z.string().min(1),
  shortName: z.string().nullable(),
  metadataSchema: z.any().nullable(),
});

export const ResourceTypeGetSchema = z
  .object({
    id: z.number().int(),
    parentId: z.number().int().nullable(),
    groupId: z.number().int().nullable(),
    name: z.string(),
    shortName: z.string().nullable(),
    metadataSchema: z.string().nullable(),
  })
  .strip();

export const ResourceTypeGetListSchema = z.array(ResourceTypeGetSchema);
