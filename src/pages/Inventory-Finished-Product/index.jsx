import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import ProductionOrderTAB from "./tabs/ProductionOrderTAB";
import StockProductCategoryTAB from "./tabs/StockProductCategoryTAB";
import StockZoneTAB from "./tabs/StockZoneTAB";
import VoucherTAB from "./tabs/VoucherTAB";

function InventoryFinishedProduct() {
  const tabsData = [
    {
      label: "Stock Zone",
      value: <StockZoneTAB />,
    },
    {
      label: "Stock Product Category",
      value: <StockProductCategoryTAB />,
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
export default InventoryFinishedProduct;
