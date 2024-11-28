import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import UnloadingJubilaTab from "./tabs/UnloadingJubilaTab";

function UnloadingJubila() {
  const tabsData = [
    {
      label: "Unloading Jubila",
      value: <UnloadingJubilaTab />,
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
export default UnloadingJubila;
