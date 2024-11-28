import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import LoadingRequestAcceptableTAB from "./tabs/LoadingRequestAcceptableTAB";

function LoadingRequestAcceptable() {
  const tabsData = [
    {
      label: "Loading Request Acceptable",
      value: <LoadingRequestAcceptableTAB />,
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
export default LoadingRequestAcceptable;
