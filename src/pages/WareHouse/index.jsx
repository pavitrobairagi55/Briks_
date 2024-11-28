import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import WareHouseTab from "./tabs/WareHouseTab";
import ItemsTab from "./tabs/items";

function WareHouse() {
  const tabsData = [
    {
      label: "Warehouse List",
      value: <WareHouseTab />,
    },
    {
      label: "items",
      value: <ItemsTab />,
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
export default WareHouse;
