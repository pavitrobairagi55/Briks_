import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import TripsToBeLoadedTAB from "./tabs/TripsToBeLoadedTAB";

function LoadingAtAlqasab() {
  const tabsData = [
    {
      label: "Trips To Be Loaded",
      value: <TripsToBeLoadedTAB />,
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
export default LoadingAtAlqasab;
