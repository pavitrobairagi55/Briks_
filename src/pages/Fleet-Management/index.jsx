import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import DriverTAB from "./tabs/DriverTAB";
import SoilRequestTAB from "./tabs/SoilRequestTAB";
import TripTAB from "./tabs/TripTAB";
import VehicleTAB from "./tabs/VehicleTAB";

function FleetManagement() {
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
      label: "Soil Request",
      value: <SoilRequestTAB />,
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
export default FleetManagement;
