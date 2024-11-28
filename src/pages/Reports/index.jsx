import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
// import CustomerOrderTab from "./tabs/CustomerOrderTab";
// import DispatchTab from "./tabs/DispatchTab";
// import FleetManagementTab from "./tabs/FleetManagementTab";
import Inventory2Tab from "./tabs/Inventory2Tab";
// import InventoryTab from "./tabs/InventoryTab";
// import ProductionOrderTab from "./tabs/ProductionOrderTab";
// import ProductionTab from "./tabs/ProductionTab";
import ReleaseTab from "./tabs/ReleaseTab";
// import SoilRequesTab from "./tabs/SoilRequesTab";

function Reports() {
  const tabsData = [
    /*     {
      label: "Customer Order",
      value: <CustomerOrderTab />,
    }, */
    /*  {
      label: "Production",
      value: <ProductionTab />,
    }, */
    {
      label: "Release",
      value: <ReleaseTab />,
    },
    {
      label: "Inventory",
      value: <Inventory2Tab />,
    },
    /*  {
      label: "Inventory2",
      value: <Inventory2Tab />,
    }, */
    /* {
      label: "Fleet Management",
      value: <FleetManagementTab />,
    },
    {
      label: "Soil Request",
      value: <SoilRequesTab />,
    },
    {
      label: "Production Order",
      value: <ProductionOrderTab />,
    }, */
    /*  {
      label: "Dispatch",
      value: <DispatchTab />,
    }, */
  ];

  return (
    <>
      <Sidebar>
        <TabsList tabsOptions={tabsData} />
      </Sidebar>
    </>
  );
}
export default Reports;
