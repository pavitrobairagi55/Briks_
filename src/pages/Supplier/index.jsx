import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import SupplierTab from "./tabs/SupplierTab";

function Supplier() {
  const tabsData = [
    {
      label: "Supplier",
      value: <SupplierTab />,
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
export default Supplier;
