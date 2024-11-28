import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import MasterDataTAB from "./tabs/MasterDataTAB";

function MasterData() {
  const tabsData = [
    {
      label: "Master Data",
      value: <MasterDataTAB />,
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
export default MasterData;
