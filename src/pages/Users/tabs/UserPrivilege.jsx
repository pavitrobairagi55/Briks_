import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";
import DeleteModal from "../../../components/DeleteModal";
import { Snackbar, SnackbarContent } from "@mui/material";
import AddPrivilegeModal from "../Modals/AddPrivilegeModal";
export default function UserPrivilege() {
  const auth = useContext(AuthContext);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectValue, setSelectValue] = useState();
  const [roles, setRoles] = useState([]);
  const [data, setData] = useState();

  const [error, setError] = useState();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchTableData();
  }, [selectValue]);
  const fetchData = async () => {
    try {
      const response = await axios.get("api/role", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      const data = response.data?.map((elem) => {
        return { id: elem.id, value: elem.name };
      });

      setRoles(data);
    } catch (error) {}
  };
  const fetchTableData = async () => {
    try {
      const response = await axios.get(
        `api/UserPrivileges/role/${selectValue}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      setData(response?.data?.data);
    } catch (error) {}
  };
  const handleOpenDeleteModal = (id) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const headCells = [
    {
      id: "PageId",
      numeric: false,
      disablePadding: true,
      label: "PageId",
    },
    {
      id: "PageName",
      numeric: true,
      disablePadding: false,
      label: "PageName",
    },
    {
      id: "Url",
      numeric: true,
      disablePadding: false,
      label: "Url",
    },
    {
      id: "Icon",
      numeric: true,
      disablePadding: false,
      label: "Icon",
    },
  ];
  const rows = data?.map((elem) => ({
    id: elem.id,
    PageId: elem.id,
    PageName: elem.name,
    Url: elem.route,
    Icon: <i className={elem.icon}></i>,
  }));
  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };
  const handleCloseAddModal = () => {
    setAddModalOpen(false);
    fetchTableData();
  };
  const handleAddSnackBar = (message, handleSaveFCN) => {
    setSnackMessage(message);
    setOpenSnackBar(true);
    handleSaveFCN();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
  const horizontal = "center";
  const vertical = "top";

  const deleteItem = async () => {
    setIsloading(true);
    try {
      await axios.delete(`api/UserPrivileges/${selectValue}/${selectedId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setIsloading(true);
      return true;
    } catch (error) {
      setIsloading(true);
      setError(error.response?.data);

      return false;
    }
  };
  const handleDeleteSnackBar = async (message) => {
    const isDeleted = await deleteItem();

    if (isDeleted) {
      setSnackMessage(message);
      setOpenSnackBar(true);
      handleCloseDeleteModal();
      fetchTableData();
      setTimeout(() => {
        setOpenSnackBar(false);
      }, 2000);
    }
  };
  return (
    <>
      <HeaderFilter
        button={"Add"}
        buttonClick={handleOpenAddModal}
        selectExists
        selectValue={selectValue}
        selectChange={(e) => setSelectValue(e.target.value)}
        selectOptions={roles}
      />
      <EnhancedTable
        rows={rows || []}
        headCells={headCells}
        toolbar={["Delete"]}
        onDelete={handleOpenDeleteModal}
      />
      {isAddModalOpen && (
        <AddPrivilegeModal
          cancelFcn={handleCloseAddModal}
          saveFcn={() => handleAddSnackBar("User Added", handleCloseAddModal)}
          closeModal={handleCloseAddModal}
          title={"Add User Privilege"}
          type={"Save"}
          withCancel={true}
          roles={roles || []}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          cancelFcn={handleCloseDeleteModal}
          saveFcn={() => handleDeleteSnackBar("Item Deleted Successfully")}
          closeModal={handleCloseDeleteModal}
          title={"Delete"}
          type={"Yes"}
          withCancel={true}
          error={error}
          isLoading={isLoading}
        />
      )}
      {openSnackBar && (
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={() => setOpenSnackBar(false)}
          key={vertical + horizontal}
        >
          <SnackbarContent
            style={{ backgroundColor: "green" }}
            message={<span>{snackMessage}</span>}
          />
        </Snackbar>
      )}
    </>
  );
}
