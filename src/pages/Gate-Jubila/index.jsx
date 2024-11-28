import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import EnterCustomerTAB from "./tabs/EnterCustomerTAB";
import EnterTAB from "./tabs/EnterTAB";
import ExitCustomerTAB from "./tabs/ExitCustomerTAB";
import ExitTAB from "./tabs/ExitTAB";

function GateJubila() {
  const tabsData = [
    {
      label: "Enter",
      value: <EnterTAB />,
    },
    {
      label: "Exit",
      value: <ExitTAB />,
    },
    {
      label: "Enter-Customer",
      value: <EnterCustomerTAB />,
    },
    {
      label: "Exit-Customer",
      value: <ExitCustomerTAB />,
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
export default GateJubila;
