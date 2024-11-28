import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import CustomerOrderTab from "./tabs/CustomerOder";
import RejectedCustomerOderTAB from "./tabs/RejectedCustomerOderTAB";

function CustomerOrderPage() {
  const tabsData = [
    {
      label: "Customer Oder",
      value: <CustomerOrderTab />,
    },
    {
      label: "Rejected Customer Order",
      value: <RejectedCustomerOderTAB />,
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
export default CustomerOrderPage;
