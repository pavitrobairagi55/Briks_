import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import CollectionRequestsTAB from "./tabs/CollectionRequestsTAB";
import MoldingRequestsTAB from "./tabs/MoldingRequestsTAB";
import CollectionRequest from "./tabs/MoldingRequestsTAB";

function ModlingRequests() {
  const tabsData = [
    {
      label: "Molding Requests",
      value: <MoldingRequestsTAB />,
    },
    {
      label: "Collection Requests",
      value: <CollectionRequestsTAB />,
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
export default ModlingRequests;
