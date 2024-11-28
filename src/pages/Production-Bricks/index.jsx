import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import MoldingRequests from "./tabs/MoldingRequests";
import ProductionBricksTAB from "./tabs/ProductionBricksTAB";

function ProductionBricks() {
  const tabsData = [
    {
      label: "Production Bricks",
      value: <ProductionBricksTAB />,
    },
    {
      label: "Molding Requests",
      value: <MoldingRequests />,
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
export default ProductionBricks;
