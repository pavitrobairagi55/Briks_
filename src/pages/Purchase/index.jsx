import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import PurshaeTab from "./tabs/PurshaeTab";

function Purchase() {
  const tabsData = [
    {
      label: "Purchase ",
      value: <PurshaeTab />,
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
export default Purchase;
