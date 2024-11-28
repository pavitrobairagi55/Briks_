import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import SoilRequestTab from "./tabs/SoilRequestTab";

function SoilRequest() {
  const tabsData = [
    {
      label: "Soil Request",
      value: <SoilRequestTab />,
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
export default SoilRequest;
