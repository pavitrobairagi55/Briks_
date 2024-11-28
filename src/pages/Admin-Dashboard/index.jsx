import { Sidebar } from "../../components/layout/Sidebar";
import TabsList from "../../components/tabs/Tabs";
import AlQasabTab from "./tabs/AlQasabTab";
import CustomerOrderTab from "./tabs/CustomerOrderTab";
import DashboardTab from "./tabs/DashboardTab";
import InventoryTab from "./tabs/InventoryTab";
import ProductionTab from "./tabs/ProductionTab";

function AdminDashbord() {
  const tabsData = [
    {
      label: "Dashboard",
      value: <DashboardTab />,
    },
    {
      label: "Al Qasab Dashboard",
      value: <AlQasabTab />,
    },
    {
      label: "Inventory Dashboard",
      value: <InventoryTab />,
    },
    {
      label: "Customer Order Dashboard",
      value: <CustomerOrderTab />,
    },
    {
      label: "Production Dashboard",
      value: <ProductionTab />,
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
export default AdminDashbord;
