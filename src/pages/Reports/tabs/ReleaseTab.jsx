import { useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import OrderSheetTabOption from "../ReleaseReports/OrderSheetTabOption";
import OrderedQuantityTabOption from "../ReleaseReports/OrderedQuantityTabOption";
import OrdersInProcessTabOption from "../ReleaseReports/OrdersInProcessTabOption";
import OrdersDeliveredTabOption from "../ReleaseReports/OrdersDeliveredTabOption";
import PendingOrdersTabOption from "../ReleaseReports/PendingOrdersTabOption";
import MissedOrdersTabOption from "../ReleaseReports/MissedOrdersTabOption";
import LiftingTabOption from "../ReleaseReports/LiftingTabOption";

export default function ReleaseTab() {
  const [selectValue, setSelectValue] = useState();
  const optionList = [
    { id: "ORDER_SHEET_REPORT", value: "Order Sheet Report" },
    { id: "ORDERED_QUANTITY_REPORT", value: "Ordered Quantity Report" },
    { id: "ORDERS_IN_PROCESS_REPORT", value: "Orders In Process Report" },
    { id: "ORDERs_DELIVERED_REPORT", value: "Orders Delivered Report" },
    { id: "PENDING_ORDERS_REPORT", value: "Pending Orders Report" },
    { id: "MISSED_ORDERS_REPORT", value: "Missed Orders Report" },
    { id: "LIFTING_REPORT", value: "Lifting Report" },
  ];
  return (
    <>
      <HeaderFilter
        selectExists
        selectValue={selectValue}
        selectChange={(val) => setSelectValue(val.target.value)}
        selectOptions={optionList}
      />
      {selectValue === "ORDER_SHEET_REPORT" && <OrderSheetTabOption />}
      {selectValue === "ORDERED_QUANTITY_REPORT" && (
        <OrderedQuantityTabOption />
      )}
      {selectValue === "ORDERS_IN_PROCESS_REPORT" && (
        <OrdersInProcessTabOption />
      )}
      {selectValue === "ORDERs_DELIVERED_REPORT" && (
        <OrdersDeliveredTabOption />
      )}

      {selectValue === "PENDING_ORDERS_REPORT" && <PendingOrdersTabOption />}
      {selectValue === "MISSED_ORDERS_REPORT" && <MissedOrdersTabOption />}
      {selectValue === "LIFTING_REPORT" && <LiftingTabOption />}
    </>
  );
}
