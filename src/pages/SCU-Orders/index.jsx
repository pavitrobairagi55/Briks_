import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import SCUOrdersListTab from "./tabs/SCUOrdersListTab";

function SCUOrders() {
  const tabsData = [
    {
      label: "SCU Orders List",
      value: <SCUOrdersListTab />,
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
export default SCUOrders;
