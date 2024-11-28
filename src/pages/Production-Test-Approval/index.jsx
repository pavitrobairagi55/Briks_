import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import ApprovalTAB from "./tabs/ApprovalTAB";
import BricksProductionOrderTAB from "./tabs/BricksProductionOrderTAB";
import CollectionTAB from "./tabs/CollectionTAB";
import FermentationTAB from "./tabs/FermentationTAB";
import MirTAB from "./tabs/MirTAB";
import MixingTAB from "./tabs/MixingTAB";
import ModlingTAB from "./tabs/ModlingTAB";
import PlasterAndMorterTAB from "./tabs/PlasterAndMorterTAB";
import StorageTAB from "./tabs/StorageTAB";

function ProductionTestApproval() {
  const tabsData = [
    {
      label: "MIR",
      value: <MirTAB />,
    },
    {
      label: "Mixing",
      value: <MixingTAB />,
    },
    {
      label: "Plaster And Morter",
      value: <PlasterAndMorterTAB />,
    },
    /*  {
      label: "Fermentation",
      value: <FermentationTAB />,
    },
    {
      label: "Bricks Production Order",
      value: <BricksProductionOrderTAB />,
    },
    {
      label: "Molding",
      value: <ModlingTAB />,
    },
    {
      label: "Collection",
      value: <CollectionTAB />,
    },
    {
      label: "Storage",
      value: <StorageTAB />,
    },
    {
      label: "Approval",
      value: <ApprovalTAB />,
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
export default ProductionTestApproval;
