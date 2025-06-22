import React from "react";
import { Alert, Button } from "@mui/material";

type ControllerLayoutProps = {
  children: React.ReactNode;
  isPending?: boolean;
  error?: Error | null;
  onSubmit?: () => void;
  customSubmitText?: string;
};

const ControllerLayout = ({
  children,
  isPending = false,
  error = null,
  onSubmit,
  customSubmitText = "Save",
}: ControllerLayoutProps) => {
  return (
    <>
      {children}
      {error && <Alert severity="error"></Alert>}
      {onSubmit && (
        <Button onClick={onSubmit} variant="contained" disabled={isPending}>
          {customSubmitText}
        </Button>
      )}
    </>
  );
};

export default ControllerLayout;
