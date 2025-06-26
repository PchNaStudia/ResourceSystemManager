import {
  ResourceGroupAccessListSchema,
  ResourceGroupAccessSchema,
} from "@common/ApiTypes";

export const getUserGroups = async () => {
  const response = await fetch(`/api/resourcesGroup`);
  if (!response.ok) {
    throw new Error(`Failed to fetch groups: ${response.statusText}`);
  }
  return ResourceGroupAccessListSchema.parse(await response.json());
};

export const getGroup = async (id: number) => {
  const response = await fetch(`/api/resourcesGroup/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch groups: ${response.statusText}`);
  }
  return ResourceGroupAccessSchema.parse(await response.json());
};
