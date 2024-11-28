import { Sidebar } from "../../components/layout/Sidebar";
import TabsList from "../../components/tabs/Tabs";
import ApprovalTAB from "./tabs/ApprovalTAB";
import StorageTAB from "./tabs/StorageTAB";

function Storage() {
  const tabsData = [
    {
      label: "Storage",
      value: <StorageTAB />,
    },
    {
      label: "Approval",
      value: <ApprovalTAB />,
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
export default Storage;
