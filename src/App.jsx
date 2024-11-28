// @/src/App.jsx
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useSearchParams,
} from "react-router-dom";
import Login from "./pages/AuthPages/login";
import { useAuth } from "./shared/authHook";
import { AuthContext } from "./shared/authContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AdminDashbord from "./pages/Admin-Dashboard";
import MasterData from "./pages/Master-Data";
import DGCLOrders from "./pages/DGCL-Orders";
import SCUOrders from "./pages/SCU-Orders";
import FleetManagement from "./pages/Fleet-Management";
import OrderVerification from "./pages/Order-Verification";
import WareHouse from "./pages/WareHouse";
import SoilRequest from "./pages/Soil-Request";
import Purchase from "./pages/Purchase";
import Supplier from "./pages/Supplier";
import Users from "./pages/Users";
import InventoryRaw from "./pages/Inventory-Raw";
import InventoryFinishedProduct from "./pages/Inventory-Finished-Product";
import QAProductiontest from "./pages/QA-Production-test";
import LoadingAtAlqasab from "./pages/Loading-At-Alqasab";
import ProductionTestApproval from "./pages/Production-Test-Approval";
import UnloadingJubila from "./pages/Unloading-Jubila";
import GateAlqasab from "./pages/Gate-Alqasab";
import GateJubila from "./pages/Gate-Jubila";
import FleetManagementCustomerOrder from "./pages/Fleet-Management-Customer-Order";
import LoadingRequest from "./pages/Loading-Request";
import FermentationRequests from "./pages/Fermentation-Requests";
import ModlingRequests from "./pages/Modling-Requests";
import MixingRequests from "./pages/Mixing-Requests";
import Collection from "./pages/Collection";
import ProductionBricks from "./pages/Production-Bricks";
import Reports from "./pages/Reports";
import CustomerOrderPage from "./pages/customer-order";
import LoadingRequestAcceptable from "./pages/Loading-Request-Acceptable";
import Storage from "./pages/Storage";
import ProtectedRoutes from "./components/layout/ProtectedRoutes";
import SplashPage from "./pages/Splash";
import NotFoundPage from "./pages/NotFoundPage.";
import UpdatePassword from "./pages/AuthPages/UpdatePassword";
import { useEffect, useState } from "react";
import EnterCustomer from "./pages/Gate-Jubila/EnterCustomer";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import EnterRequest from "./pages/Gate-Jubila/EnterRequest";

const App = () => {
  const {
    token,
    login,
    logout,
    userId,
    navItems,
    role,
    userData,
    isLoading,
    isRefreshModalOpen,
    refreshToken,
    refreshTokenFcn,
    tokenExpirationDate,
    updateProfile,
  } = useAuth();
  const queryString = window.location.search;

  if (queryString.includes("firstLogin=true")) {
    localStorage.setItem("firstLogin", true);
  }
  // const routes = (
  //   <Routes>
  //     <Route
  //       element={<ProtectedRoutes isAllowed={!!token} redirectPath="/login" />}
  //     >
  //       <Route
  //         path="/"
  //         element={<Navigate to={navItems[0]?.route} replace={true} />}
  //       />
  //       {/* PUBLIC */}
  //       <Route
  //         element={
  //           <ProtectedRoutes
  //             isAllowed={role?.find((elem) =>
  //               ["SUPER ADMIN", "SUB-CONTRACTOR"].includes(elem)
  //             )}
  //             redirectPath={navItems[0]?.route}
  //           />
  //         }
  //       >
  //         <Route
  //           path="/customer/customer-order"
  //           element={<CustomerOrderPage />}
  //         />
  //         <Route
  //           path="/fleetcustomerorder"
  //           element={<FleetManagementCustomerOrder />}
  //         />
  //       </Route>
  //       {/* SETS */}
  //       <Route
  //         element={
  //           <ProtectedRoutes
  //             isAllowed={role?.find((elem) =>
  //               ["SETS", "SUPER ADMIN"].includes(elem)
  //             )}
  //             redirectPath={navItems[0]?.route}
  //           />
  //         }
  //       >
  //         <Route
  //           path="/order/order-verification"
  //           element={<OrderVerification />}
  //         />
  //       </Route>

  //       <Route
  //         element={
  //           <ProtectedRoutes
  //             isAllowed={role?.find((elem) =>
  //               ["SETS", "DGCL", "SUPER ADMIN", "SCU"].includes(elem)
  //             )}
  //             redirectPath={navItems[0]?.route}
  //           />
  //         }
  //       >
  //         <Route index path="/admindashboard" element={<AdminDashbord />} />
  //       </Route>

  //       {/* DGCL*/}
  //       <Route
  //         element={
  //           <ProtectedRoutes
  //             isAllowed={role?.find((elem) =>
  //               ["DGCL", "SUPER ADMIN"].includes(elem)
  //             )}
  //             redirectPath={navItems[0]?.route}
  //           />
  //         }
  //       >
  //         <Route path="/order/order" element={<DGCLOrders />} />;
  //       </Route>

  //       {/* DISPATCH-OFFICER*/}
  //       <Route
  //         element={
  //           <ProtectedRoutes
  //             isAllowed={role?.find((elem) =>
  //               ["DISPATCH-OFFICER", "SUPER ADMIN"].includes(elem)
  //             )}
  //             redirectPath={navItems[0]?.route}
  //           />
  //         }
  //       >
  //         <Route path="/loading-request" element={<LoadingRequest />} />;
  //       </Route>

  //       {/* INVENTORY-FINISHED */}
  //       <Route
  //         element={
  //           <ProtectedRoutes
  //             isAllowed={role?.find((elem) =>
  //               [
  //                 "INVENTORY-FINISHED",
  //                 "SUPER ADMIN",
  //                 "INVENTORY-FINISHED-CUSTODIAN",
  //               ].includes(elem)
  //             )}
  //             redirectPath={navItems[0]?.route}
  //           />
  //         }
  //       >
  //         <Route
  //           path="/inventory-finished-product"
  //           element={<InventoryFinishedProduct />}
  //         />
  //         <Route
  //           path="/loading-request-acceptable"
  //           element={<LoadingRequestAcceptable />}
  //         />
  //       </Route>

  //       {/* AL-JUBAILAH-GUARD */}
  //       <Route
  //         element={
  //           <ProtectedRoutes
  //             isAllowed={role?.find((elem) =>
  //               ["AL-JUBAILAH-GUARD", "SUPER ADMIN"].includes(elem)
  //             )}
  //             redirectPath={navItems[0]?.route}
  //           />
  //         }
  //       >
  //         <Route path="/gate-pass-jubila" element={<GateJubila />} />;
  //         <Route
  //           path="/gate-pass-jubila/EnterCustomer/:id"
  //           element={<EnterCustomer />}
  //         />
  //         ;
  //       </Route>

  //       {/* SCU */}
  //       <Route
  //         element={
  //           <ProtectedRoutes
  //             isAllowed={role?.find((elem) =>
  //               ["SCU", "SUPER ADMIN"].includes(elem)
  //             )}
  //             redirectPath={navItems[0]?.route}
  //           />
  //         }
  //       >
  //         <Route path="/order/SCU-order" element={<SCUOrders />} />;
  //         <Route path="/production/production" element={<SoilRequest />} />;
  //         <Route path="/inventory-raw-material" element={<InventoryRaw />} />;
  //       </Route>
  //       {/* SCU  SUB-CONTRACTOR */}
  //       <Route
  //         element={
  //           <ProtectedRoutes
  //             isAllowed={role?.find((elem) =>
  //               ["SUPER ADMIN", "SUB-CONTRACTOR", "SCU"].includes(elem)
  //             )}
  //             redirectPath={navItems[0]?.route}
  //           />
  //         }
  //       >
  //         <Route
  //           path="/fleetmanagement/fleetmanagement"
  //           element={<FleetManagement />}
  //         />
  //       </Route>

  //       {/*SUPER ADMIN */}
  //       <Route
  //         element={
  //           <ProtectedRoutes
  //             isAllowed={role?.find((elem) => ["SUPER ADMIN"].includes(elem))}
  //             redirectPath={navItems[0]?.route}
  //           />
  //         }
  //       >
  //         <Route path="/masterData/masterData" element={<MasterData />} />;
  //         <Route path="/warehouse/warehouse" element={<WareHouse />} />;
  //         <Route path="/purchase/purchase" element={<Purchase />} />;
  //         <Route path="/supplier" element={<Supplier />} />;
  //         <Route path="/user" element={<Users />} /> ;
  //         <Route path="/qa-testing" element={<QAProductiontest />} />;
  //         <Route path="/loading_at_alqasab" element={<LoadingAtAlqasab />} />
  //         <Route
  //           path="/qa-test-validation"
  //           element={<ProductionTestApproval />}
  //         />
  //         ;
  //         <Route path="/unloading-jubila" element={<UnloadingJubila />} />;
  //         <Route path="/gate-pass-alqasab" element={<GateAlqasab />} />;
  //         <Route
  //           path="/fermentationrequest"
  //           element={<FermentationRequests />}
  //         />
  //         ;
  //         <Route path="/moldingrequest" element={<ModlingRequests />} />;
  //         <Route path="/mixingrequest" element={<MixingRequests />} />;
  //         <Route path="/collection" element={<Collection />} />;
  //         <Route
  //           path="/productionbricksrequest"
  //           element={<ProductionBricks />}
  //         />
  //         ;
  //         <Route path="/storage" element={<Storage />} />;
  //         <Route path="/reports" element={<Reports />} />;
  //       </Route>
  //     </Route>
  //     <Route path="/login" element={<Login />} />
  //     <Route path="/forgotPassword" element={<ForgotPassword />} />
  //     <Route path="/updatePass/:email" element={<UpdatePassword />} />
  //     <Route path="/resetPassword" element={<ResetPassword />} />
  //     <Route path="/*" element={<NotFoundPage />} />
  //   </Routes>
  // );
  let routes;
  if (token || userData) {
    routes = (
      <Routes>
        <Route path="/" element={<AdminDashbord />} />
        <Route path="/masterData/masterData" element={<MasterData />} />;
        <Route
          path="/customer/customer-order"
          element={<CustomerOrderPage />}
        />
        ;
        <Route path="/order/order" element={<DGCLOrders />} />;
        <Route path="/order/SCU-order" element={<SCUOrders />} />;
        <Route
          path="/fleetmanagement/fleetmanagement"
          element={<FleetManagement />}
        />
        <Route
          path="/order/order-verification"
          element={<OrderVerification />}
        />
        ;
        <Route path="/warehouse/warehouse" element={<WareHouse />} />;
        <Route path="/production/production" element={<SoilRequest />} />;
        <Route path="/purchase/purchase" element={<Purchase />} />;
        <Route path="/supplier" element={<Supplier />} />;
        <Route path="/user" element={<Users />} />;
        <Route path="/inventory-raw-material" element={<InventoryRaw />} />;
        <Route
          path="/inventory-finished-product"
          element={<InventoryFinishedProduct />}
        />
        ;
        <Route path="/qa-testing" element={<QAProductiontest />} />;
        <Route path="/loading_at_alqasab" element={<LoadingAtAlqasab />} />
        ;
        <Route
          path="/qa-test-validation"
          element={<ProductionTestApproval />}
        />
        ;
        <Route path="/unloading-jubila" element={<UnloadingJubila />} />;
        <Route path="/gate-pass-alqasab" element={<GateAlqasab />} />;
        <Route path="/gate-pass-jubila" element={<GateJubila />} />;
        <Route
          path="/gate-pass-jubila/EnterCustomer/:id"
          element={<EnterCustomer />}
        />
        <Route
          path="/gate-pass-jubila/EnterRequest/:id"
          element={<EnterRequest />}
        />
        <Route
          path="/fleetcustomerorder"
          element={<FleetManagementCustomerOrder />}
        />
        ;
        <Route path="/loading-request" element={<LoadingRequest />} />;
        <Route path="/fermentationrequest" element={<FermentationRequests />} />
        ;
        <Route path="/moldingrequest" element={<ModlingRequests />} />;
        <Route path="/mixingrequest" element={<MixingRequests />} />;
        <Route path="/collection" element={<Collection />} />;
        <Route path="/productionbricksrequest" element={<ProductionBricks />} />
        ;
        <Route path="/storage" element={<Storage />} />;
        <Route path="/reports" element={<Reports />} />;
        <Route
          path="/loading-request-acceptable"
          element={<LoadingRequestAcceptable />}
        />
        ;
        <Route path="/admindashboard" element={<AdminDashbord />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/updatePass/:email" element={<UpdatePassword />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            isLoggedIn: !!token,
            userId: userId,
            token: token,
            navItems: navItems,
            role: role,
            userData: userData,
            login: login,
            logout: logout,
            isLoading: isLoading,
            isRefreshModalOpen: !!isRefreshModalOpen,
            refreshToken,
            refreshTokenFcn,
            tokenExpirationDate,
            updateProfile,
          }}
        >
          {isLoading ? <SplashPage /> : routes}
        </AuthContext.Provider>
      </BrowserRouter>
    </LocalizationProvider>
  );
};

export default App;
