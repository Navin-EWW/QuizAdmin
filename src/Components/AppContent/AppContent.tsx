import { lazy, memo, Suspense } from "react";
import { Navigate, Route, Router, Routes } from "react-router-dom";
import { lazyImport } from "../../utils/lazyImport";

import PrivateRouter, {
  PrivateRouteProps,
} from "../../Routes/RootNavigator/PrivateRouter";
import Spinner from "../../utils/Spinner";
import { PublicRouteProps } from "../../Routes/RootNavigator/PublicRouter";
import { BankTransferManagmentList } from "../../Pages/BankTransferManagment/BankTransferManagmentList/BankTransferManagmentList";
import { BankTransferManagmentCharges } from "../../Pages/BankTransferManagment/BankTransferManagmentCharges/BankTransferManagmentCharges";
import { BankTransferManagmentDetails } from "../../Pages/BankTransferManagment/BankTransferManagmentDetails/BankTransferManagmentDetails";
import { CreateBankCharges } from "../../Pages/BankTransferManagment/CreateBankCharges/CreateBankCharges";
import { BankTransferChargesEdit } from "../../Pages/BankTransferManagment/BankTransferChargesEdit/BankTransferChargesEdit";

const { NoDataFound404 } = lazyImport(
  () => import("../NoDataFound404/NoDataFound404"),
  "NoDataFound404"
);

const { BulkCustomerOrder } = lazyImport(
  () =>
    import(
      "../../Pages/Order/OrderDetails/BulkCustomerOrder/BulkCustomerOrder"
    ),
  "BulkCustomerOrder"
);

const { OrderError } = lazyImport(
  () => import("../../Pages/Order/CreateOrder/OrderError"),
  "OrderError"
);

const { ErrorStatus } = lazyImport(
  () => import("../../Pages/Order/EditBulkOrder/ErrorStatus"),
  "ErrorStatus"
);

const { ServiceSupplierList } = lazyImport(
  () =>
    import(
      "../../Pages/ServiceSupplierManagement/ServiceSupplierList/ServiceSupplierList"
    ),
  "ServiceSupplierList"
);

const { ServiceSupplierCreate } = lazyImport(
  () =>
    import(
      "../../Pages/ServiceSupplierManagement/ServiceSupplierCreate/ServiceSupplierCreate"
    ),
  "ServiceSupplierCreate"
);

const { CreateRoutingRule } = lazyImport(
  () => import("../../Pages/RoutingRule/CreateRoutingRule/CreateRoutingRule"),
  "CreateRoutingRule"
);

const { RoutingRuleDetails } = lazyImport(
  () => import("../../Pages/RoutingRule/RoutingRuleDetails/RoutingRuleDetails"),
  "RoutingRuleDetails"
);

const { RoutesManagement } = lazyImport(
  () =>
    import(
      "../../Pages/RoutingRule/RoutingRuleList/RoutesManagement/RoutesManagement"
    ),
  "RoutesManagement"
);

const { OrderManagement } = lazyImport(
  () => import("../../Pages/Order/Order_list/OrderManagement/OrderManagement"),
  "OrderManagement"
);

const { ServiceSupplierDetails } = lazyImport(
  () =>
    import(
      "../../Pages/ServiceSupplierManagement/SeviceSupplierDetails/ServiceSupplierDetails"
    ),
  "ServiceSupplierDetails"
);

const { CreateOrder } = lazyImport(
  () => import("../../Pages/Order/CreateOrder/CreateOrder"),
  "CreateOrder"
);

const { EditBulkOrder } = lazyImport(
  () => import("../../Pages/Order/EditBulkOrder/EditBulkOrder"),
  "EditBulkOrder"
);

const { SuccessStatus } = lazyImport(
  () => import("../../Pages/Order/EditBulkOrder/SuccessStatus"),
  "SuccessStatus"
);

const { OrderDetail } = lazyImport(
  () => import("../../Pages/Order/OrderDetails/OrderDetail"),
  "OrderDetail"
);

const { CreateUser } = lazyImport(
  () => import("../../Pages/ClientManagement/CreateUser/CreateUser"),
  "CreateUser"
);
const { Dashboard } = lazyImport(
  () => import("../../Pages/Dashboard/index"),
  "Dashboard"
);

const { SubjectDetail } = lazyImport(
  () => import("../../Pages/SubjectManagement/SubjectDetail/SubjectDetail"),
  "SubjectDetail"
);
const { MerchantDetails } = lazyImport(
  () => import("../../Pages/ClientManagement/MerchantDetails/MerchantDetail"),
  "MerchantDetails"
);
const { MyAccount } = lazyImport(
  () => import("../../Pages/Account/Account"),
  "MyAccount"
);
const { SubjectTable } = lazyImport(
  () => import("../../Pages/SubjectManagement/SubjectTable/SubjectTable"),
  "SubjectTable"
);
const { CreateSubject } = lazyImport(
  () => import("../../Pages/SubjectManagement/CreateSubject/CreateSubject"),
  "CreateSubject"
);
const { ClientTable } = lazyImport(
  () => import("../../Pages/ClientManagement/MerchantTable/ClientTable"),
  "ClientTable"
);
const { UserTable } = lazyImport(
  () => import("../../Pages/ClientManagement/UserTable/UserTable"),
  "UserTable"
);
const { UserDetail } = lazyImport(
  () => import("../../Pages/ClientManagement/UserDetails/UserDetails"),
  "UserDetail"
);
const { CreateMerchant } = lazyImport(
  () => import("../../Pages/ClientManagement/CreateMerchant/CreateMerchant"),
  "CreateMerchant"
);

const AppContent = () => {
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
        {/* merchant */}
        <Route path="merchant">
          <Route
            // index
            path="list"
            element={
              <PrivateRouter
                {...defaultPrivateRouteProps}
                outlet={<ClientTable />}
              />
            }
          />
          <Route path="add" element={<CreateMerchant />} />
          <Route path="list/:id" element={<MerchantDetails />} />
        </Route>

        {/* users  */}

        <Route path="user">
          <Route
            // index
            path="list"
            element={
              <PrivateRouter
                {...defaultPrivateRouteProps}
                outlet={<UserTable />}
              />
            }
          />
          <Route path="add" element={<CreateUser />} />
          <Route path="list/:id" element={<UserDetail />} />
        </Route>

        {/* admin management */}

        <Route path="admin">
          <Route
            // index
            path="list"
            element={
              <PrivateRouter
                {...defaultPrivateRouteProps}
                outlet={<SubjectTable />}
              />
            }
          />

          <Route path="add" element={<CreateSubject />} />
          <Route path="list/:id" element={<SubjectDetail />} />
        </Route>
        {/* order */}

        <Route path="order">
          <Route
            // index
            path="list"
            element={
              <PrivateRouter
                {...defaultPrivateRouteProps}
                outlet={<OrderManagement />}
              />
            }
          />

          <Route path="add" element={<CreateOrder />} />
          <Route path="bulkorder" element={<BulkCustomerOrder />} />
          <Route path="list/:id" element={<OrderDetail />} />
          <Route path="errors/:id" element={<OrderError />} />
          <Route path="edit-bulkorder" element={<EditBulkOrder />} />
          <Route path="success/:id" element={<SuccessStatus />} />
          <Route path="error/:id" element={<ErrorStatus />} />
        </Route>

        {/*account */}
        <Route path="account">
          <Route
            index
            element={
              <PrivateRouter
                {...defaultPrivateRouteProps}
                outlet={<MyAccount />}
              />
            }
          />
        </Route>

        {/* <Route path="/dashboard">
          <Route
            index
            element={
              <PrivateRouter
                {...defaultPrivateRouteProps}
                outlet={<Dashboard />}
              />
            }
          />
        </Route> */}

        <Route path="/merchant" element={<Navigate to="/merchant/list" />} />
        {/* <Route path="*" element={<Navigate to="/dashboard" />} /> */}
        <Route path="*" element={<Navigate to="/order/list" />} />

        <Route path="routing-rule">
          <Route
            // index
            path="list"
            element={
              <PrivateRouter
                {...defaultPrivateRouteProps}
                outlet={<RoutesManagement />}
              />
            }
          />

          <Route path="list/:id" element={<RoutingRuleDetails />} />
          <Route path="add" element={<CreateRoutingRule />} />
        </Route>

        <Route path="service-supplier">
          <Route
            // index
            path="list"
            element={
              <PrivateRouter
                {...defaultPrivateRouteProps}
                outlet={<ServiceSupplierList />}
              />
            }
          />
          <Route path="list/:id" element={<ServiceSupplierDetails />} />
          <Route path="add" element={<ServiceSupplierCreate />} />
        </Route>

        <Route path="bank-transfer">
          <Route
            path="list"
            element={
              <PrivateRouter
                {...defaultPrivateRouteProps}
                outlet={<BankTransferManagmentList />}
              />
            }
          />
          <Route path="list/:id" element={<BankTransferManagmentDetails />} />
        </Route>

        <Route path="charges">
          <Route
            path="list"
            element={
              <PrivateRouter
                {...defaultPrivateRouteProps}
                outlet={<BankTransferManagmentCharges />}
              />
            }
          />
          <Route path="add" element={<CreateBankCharges />} />
          <Route path="list/:id" element={<BankTransferChargesEdit />} />
        </Route>
        {/* Not Found */}
        {/* <Route path="*" element={<NoDataFound404 />} /> */}
      </Routes>
    </Suspense>
  );
};

export default memo(AppContent);

const defaultPublicRouteProps: Omit<PublicRouteProps, "outlet"> = {
  authenticatedPath: "/",
};

const defaultPrivateRouteProps: Omit<PrivateRouteProps, "outlet"> = {
  authenticationPath: "/login",
};
