import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import FermentationRequestsTAB from "./tabs/FermentationRequestsTAB";
import MixingRequestsTAB from "./tabs/MixingRequestsTAB";
import MorterAndPlasterRequestsTAB from "./tabs/MorterAndPlasterRequestsTAB";

function MixingRequests() {
  const tabsData = [
    {
      label: "Mixing Requests",
      value: <MixingRequestsTAB />,
    },
    {
      label: "Morter And Plaster Requests",
      value: <MorterAndPlasterRequestsTAB />,
    },
    /*  {
      label: "Fermentation Requests",
      value: <FermentationRequestsTAB />,
    }, */
  ];

  return (
    <>
      <Sidebar>
        <TabsList tabsOptions={tabsData} />
      </Sidebar>
    </>
  );
}
export default MixingRequests;
