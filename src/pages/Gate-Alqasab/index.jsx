import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import EnterTAB from "./tabs/EnterTAB";
import ExitTAB from "./tabs/ExitTAB";

function GateAlqasab() {
  const tabsData = [
    {
      label: "Enter",
      value: <EnterTAB />,
    },
    {
      label: "Exit",
      value: <ExitTAB />,
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
export default GateAlqasab;
