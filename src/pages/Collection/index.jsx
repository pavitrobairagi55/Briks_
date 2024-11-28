import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import CollectionRequestTab from "./tabs/CollectionRequestTab";
import StorageTab from "./tabs/StorageTab";

function Collection() {
  const tabsData = [
    {
      label: "Collection requests",
      value: <CollectionRequestTab />,
    },
    {
      label: "Storage",
      value: <StorageTab />,
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
export default Collection;
