import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import DriverTAB from "./tabs/DriverTAB";
import SoilRequestTAB from "./tabs/CustomerOrderTAB";
import TripTAB from "./tabs/TripTAB";
import VehicleTAB from "./tabs/VehicleTAB";
import CustomerOrderTAB from "./tabs/CustomerOrderTAB";

function FleetManagementCustomerOrder() {
  const tabsData = [
    {
      label: "Vehicle",
      value: <VehicleTAB />,
    },
    {
      label: "Driver",
      value: <DriverTAB />,
    },
    {
      label: "Customer Order",
      value: <CustomerOrderTAB />,
    },
    {
      label: "Trip",
      value: <TripTAB />,
    },
  ];

  return (
    <>
      <Sidebar>
        <TabsList tabsOptions={tabsData} />
      </Sidebar>
    </>
  );
}
export default FleetManagementCustomerOrder;
