import {
  ZodObject,
  ZodRawShape,
  UnknownKeysParam,
  ZodTypeAny,
  objectInputType,
} from "zod";
import React from "react";
import { useParams } from "react-router";

type ValidatedSchema<Output> = {
  paramValidator: ZodObject<
    ZodRawShape,
    UnknownKeysParam,
    ZodTypeAny,
    Output,
    objectInputType<ZodRawShape, ZodTypeAny, UnknownKeysParam>
  >;
  element: (params: Output) => React.ReactElement;
  invalid: React.ReactElement;
};

type ValidatedRouteProps<Output> = ValidatedSchema<Output>;

function ValidateRoute<Output>({
  paramValidator,
  element,
  invalid,
}: ValidatedRouteProps<Output>) {
  const params = useParams();
  const parsedParams = paramValidator.safeParse(params);
  return parsedParams.success ? element(parsedParams.data) : invalid;
}

export default ValidateRoute;
