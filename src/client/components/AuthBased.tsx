import React from "react";
import {useAuth} from "@client/AuthContext";

type AuthBasedProps = {
  authedElement: React.ReactNode;
  unAuthedElement: React.ReactNode;
};

const AuthBased = ({unAuthedElement, authedElement}: AuthBasedProps) => {
  const { user } = useAuth();
  return <>{user ? authedElement : unAuthedElement}</>;
};

export default AuthBased;
