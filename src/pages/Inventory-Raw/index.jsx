import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import ProductionOrderTAB from "./tabs/ProductionOrderTAB";
import StockItemTAB from "./tabs/StockItemTAB";
import StockZoneTAB from "./tabs/StockZoneTAB";
import VoucherTAB from "./tabs/VoucherTAB";

function InventoryRaw() {
  const tabsData = [
    {
      label: "Stock Zone",
      value: <StockZoneTAB />,
    },
    {
      label: "Stock Item",
      value: <StockItemTAB />,
    },
    {
      label: "Voucher",
      value: <VoucherTAB />,
    },
    /* {
      label: "Production Order",
      value: <ProductionOrderTAB />,
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
export default InventoryRaw;
