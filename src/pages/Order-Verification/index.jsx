import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import OrderAcceptedTAB from "./tabs/OrderAcceptedTAB";
import OrderRejectedTAB from "./tabs/OrderRejectedTAB";
import OrderVerificationTAB from "./tabs/OrderVerificationTAB";
import CollectionRequest from "./tabs/OrderVerificationTAB";

function OrderVerification() {
  const tabsData = [
    {
      label: "Order Verification",
      value: <OrderVerificationTAB />,
    },
    /*  {
      label: "Order Rejected",
      value: <OrderRejectedTAB />,
    },
    {
      label: "Order Accepted",
      value: <OrderAcceptedTAB />,
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
export default OrderVerification;
