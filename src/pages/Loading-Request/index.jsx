import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import LoadingRequestTAB from "./tabs/LoadingRequestTAB";

function LoadingRequest() {
  const tabsData = [
    {
      label: "Loading Request",
      value: <LoadingRequestTAB />,
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
export default LoadingRequest;
