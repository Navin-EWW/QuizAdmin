/* eslint-disable react-hooks/exhaustive-deps */
import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PrivateRouter, { PrivateRouteProps } from "./PrivateRouter";
import PublicRouter, { PublicRouteProps } from "./PublicRouter";
import Spinner from "../../utils/Spinner";
import { lazyImport } from "../../utils/lazyImport";


const { DefaultLayout } = lazyImport(
  () => import("../../Layout/DefaultLayout"),
  "DefaultLayout"
);
const { ForgotPassword } = lazyImport(
  () => import("../../Pages/ForgotPassword/ForgotPassword"),
  "ForgotPassword"
);
const { ResetPassword } = lazyImport(
  () => import("../../Pages/ResetPassword/ResetPassword"),
  "ResetPassword"
);
const { Login } = lazyImport(() => import("../../Pages/Login/Login"), "Login");

// const ClientTable = lazyImport(() => import("../../container/ClientManagement/MerchantTable/ClientTable"))

const RootNavigator = () => {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Spinner />
        </div>
      }
    >

        <Routes>
          <Route
            path="/login"
            element={
              <PublicRouter {...defaultPublicRouteProps} outlet={<Login />} />
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRouter
                {...defaultPublicRouteProps}
                outlet={<ForgotPassword />}
              />
            }
          />

          <Route
            path="/reset-password"
            element={
              <PublicRouter
                {...defaultPublicRouteProps}
                outlet={<ResetPassword />}
              />
            }
          />

          <Route
            path="*"
            element={
              <PrivateRouter
                {...defaultPrivateRouteProps}
                outlet={<DefaultLayout />}
              />
            }
          />
        </Routes>
   
    </Suspense>
  );
};

export default RootNavigator;

const defaultPublicRouteProps: Omit<PublicRouteProps, "outlet"> = {
  authenticatedPath: "/",
};

const defaultPrivateRouteProps: Omit<PrivateRouteProps, "outlet"> = {
  authenticationPath: "/login",
};
