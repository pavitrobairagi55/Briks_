import { Sidebar } from "../../components/layout/Sidebar";

import TabsList from "../../components/tabs/Tabs";
import AddMenuList from "./tabs/AddMenuList";
import UserPrivilege from "./tabs/UserPrivilege";
import UserList from "./tabs/UserList";

function Users() {
  const tabsData = [
    {
      label: "User List",
      value: <UserList />,
    },
    {
      label: "User Privilege",
      value: <UserPrivilege />,
    },
    {
      label: "Add Menu List",
      value: <AddMenuList />,
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
export default Users;
