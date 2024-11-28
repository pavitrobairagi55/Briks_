import { useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import OrderSheetTabOption from "../ReleaseReports/OrderSheetTabOption";
import OrderedQuantityTabOption from "../ReleaseReports/OrderedQuantityTabOption";
import OrdersInProcessTabOption from "../ReleaseReports/OrdersInProcessTabOption";
import OrdersDeliveredTabOption from "../ReleaseReports/OrdersDeliveredTabOption";
import PendingOrdersTabOption from "../ReleaseReports/PendingOrdersTabOption";
import MissedOrdersTabOption from "../ReleaseReports/MissedOrdersTabOption";
import LiftingTabOption from "../ReleaseReports/LiftingTabOption";
import BasicInventoryTabOption from "../InventoryReports/BasicInventoryTabOption";
import AsOfInventoryTabOption from "../InventoryReports/AsOfInventoryTabOption";
import InventoryBinCardsTabOption from "../InventoryReports/InventoryBinCardsTabOption";
import ZoneWiseBricksInventoryTabOption from "../InventoryReports/ZoneWiseBricksInventoryTabOption";
import MortarDryMixInventoryTabOption from "../InventoryReports/MortarDryMixInventoryTabOption";
import PlasterDryMixInventoryTabOption from "../InventoryReports/PlasterDryMixInventoryTabOption";
import InventoryOfRawTabOption from "../InventoryReports/InventoryOfRawTabOption";
import InventoryAgingTabOption from "../InventoryReports/InventoryAgingTabOption";

export default function Inventory2Tab() {
  const [selectValue, setSelectValue] = useState();
  const optionList = [
    { id: "BASIC_INVENTORY_REPORT", value: "Basic Inventory Report" },
    { id: "AS_OF_INVENTORY_REPORT", value: "As of Inventory Report" },
    { id: "INVENTORY_BIN_CARDS_REPORT", value: "Inventory Bin Cards (Cardex)" },
    /*     { id: "ZONE_WISE_BRICKS_REPORT", value: "Zone Wise Bricks Report" },
     */ /* { id: "MORTAR_DRY_MIX_REPORT", value: "Mortar Dry Mix Report" },
    { id: "PLASTER_DRY_MIX_REPORT", value: "Plaster Dry Mix Report" }, */
    {
      id: "INVENTORY_OF_RAW_REPORT",
      value: "Inventory of Raw Materials",
    },
    /* {
      id: "INVENTORY_AGING_REPORT",
      value: "Inventory Aging Report",
    }, */
  ];
  return (
    <>
      <HeaderFilter
        selectExists
        selectValue={selectValue}
        selectChange={(val) => setSelectValue(val.target.value)}
        selectOptions={optionList}
      />
      {selectValue === "BASIC_INVENTORY_REPORT" && <BasicInventoryTabOption />}
      {selectValue === "AS_OF_INVENTORY_REPORT" && <AsOfInventoryTabOption />}
      {selectValue === "INVENTORY_BIN_CARDS_REPORT" && (
        <InventoryBinCardsTabOption />
      )}
      {selectValue === "ZONE_WISE_BRICKS_REPORT" && (
        <ZoneWiseBricksInventoryTabOption />
      )}

      {selectValue === "MORTAR_DRY_MIX_REPORT" && (
        <MortarDryMixInventoryTabOption />
      )}
      {selectValue === "MLASTER_DRY_MIX_REPORT" && (
        <PlasterDryMixInventoryTabOption />
      )}
      {selectValue === "INVENTORY_OF_RAW_REPORT" && <InventoryOfRawTabOption />}
      {selectValue === "INVENTORY_AGING_REPORT" && <InventoryAgingTabOption />}
    </>
  );
}
