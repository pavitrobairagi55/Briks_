import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import CollectionRequest from "./tabs/CollectionRequest";

function ProjectPage() {
  const tabsData = [
    {
      label: "T1",
      value: <div>Hello T1</div>,
    },
    {
      label: "T2",
      value: <div>Hello T2</div>,
    },
    {
      label: "T3",
      value: <CollectionRequest />,
    },
    {
      label: "T4",
      value: <div>Hello T4</div>,
    },
    {
      label: "T5",
      value: <div>Hello T5</div>,
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
export default ProjectPage;
