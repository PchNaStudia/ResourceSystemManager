import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  ListItemButton,
} from "@mui/material";
import React from "react";
import { z } from "zod";
import { ResourceGroupAccessListSchema } from "@common/ApiTypes";
import { useNavigate } from "react-router";
import { useAuth } from "@client/AuthContext";

type CurrentReservationsWidgetProps = {
  data: z.infer<typeof ResourceGroupAccessListSchema>;
};

export default function GroupsWidget({ data }: CurrentReservationsWidgetProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Card
      variant="elevation"
      sx={{
        width: "40dvw",
        height: "80dvh",
        display: "flex",
        justifyContent: "center",
        borderRadius: 1,
        padding: 3,
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Your Groups
        </Typography>
        <List>
          {data.map((group) => (
            <ListItem key={group.resourceGroups.id} divider>
              <ListItemButton
                onClick={() =>
                  void navigate(`/group/${group.resourceGroups.id}`)
                }
              >
                <ListItemText
                  primary={`Group #${group.resourceGroups.id}`}
                  secondary={
                    group.resourceGroups.ownerId === user?.id
                      ? "You are the owner"
                      : "Member"
                  }
                />
                {group.resourceGroups.ownerId === user?.id && (
                  <Chip label="Owner" color="primary" size="small" />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
