import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import FermentationRequestsTAB from "./tabs/FermentationRequestsTAB";
import ProductionBricksRequestsTAB from "./tabs/ProductionBricksRequestsTAB";

function FermentationRequests() {
  const tabsData = [
    {
      label: "Fermentation Requests",
      value: <FermentationRequestsTAB />,
    },
    {
      label: "Production Bricks Requests",
      value: <ProductionBricksRequestsTAB />,
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
export default FermentationRequests;
