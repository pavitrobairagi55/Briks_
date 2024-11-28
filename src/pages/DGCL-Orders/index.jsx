import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import CustomerOrder from "./tabs/CustomerOrder";

function DGCLOrders() {
  const tabsData = [
    {
      label: "Customer Order",
      value: <CustomerOrder />,
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
export default DGCLOrders;
