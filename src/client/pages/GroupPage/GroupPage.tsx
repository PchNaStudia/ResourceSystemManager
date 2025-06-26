import React from "react";
import ControllerLayout from "@client/components/ControllerLayout";
import { Card, CardContent, Typography } from "@mui/material";
import useService from "./GroupService";
import { useAuth } from "@client/AuthContext";

type ResourceGroupPageProps = {
  id: number;
};

const ResourceGroupPage = ({ id }: ResourceGroupPageProps) => {
  const { data, error, isPending } = useService(id);
  const { user } = useAuth();

  return (
    <ControllerLayout isPending={isPending} error={error}>
      <Card sx={{ marginTop: 2 }}>
        <CardContent>
          <Typography variant="h5">
            Group ID: {data.resourceGroups.id}
          </Typography>
          <Typography variant="body1">
            You are{" "}
            {data.resourceGroups.ownerId === user?.id
              ? "the owner"
              : "a member"}{" "}
            of this group.
          </Typography>
        </CardContent>
      </Card>
    </ControllerLayout>
  );
};

export default ResourceGroupPage;
