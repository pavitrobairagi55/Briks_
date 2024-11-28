import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import MirAthel from "./tabs/MirAthel";
import MirTab from "./tabs/MirTab";
import MixingTab from "./tabs/MixingTab";
import WirTab from "./tabs/WirTab";

function QAProductiontest() {
  const tabsData = [
    {
      label: "MIR",
      value: <MirTab />,
    },
    {
      label: "MIXING",
      value: <MixingTab />,
    },
    /*     {
      label: "MIR Athel",
      value: <MirAthel />,
    }, */
    {
      label: "WIR",
      value: <WirTab />,
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
export default QAProductiontest;
