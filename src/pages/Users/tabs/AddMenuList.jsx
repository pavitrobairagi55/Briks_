import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";
import DeleteModal from "../../../components/DeleteModal";
import AddMenuModal from "../Modals/AddMenuModal";
import ViewMenuModal from "../Modals/ViewMenuModal";
import EditMenuModal from "../Modals/EditMenuModal";
import { Snackbar, SnackbarContent } from "@mui/material";
export default function AddMenuList() {
  const [search, setSearch] = useState(" ");
  const [data, setData] = useState([]);
  const auth = useContext(AuthContext);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState();
  const [isLoading, setIsloading] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get("api/Menus", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setData(response.data.data);
    } catch (error) {}
  };
  const rows = data.map((elem) => {
    return {
      id: elem.id,
      Name: elem.name,
      Variant: elem.rolesCollection,
      Icon: <i className={elem.icon}></i>,
    };
  });

  const handleOpenDeleteModal = (id) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleOpenEditModal = (id) => {
    setSelectedId(id);
    setEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    fetchData();
    setEditModalOpen(false);
  };
  const handleOpenViewModal = (id) => {
    setSelectedId(id);
    setViewModalOpen(true);
  };
  const handleCloseViewModal = () => {
    setViewModalOpen(false);
  };

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };
  const handleCloseAddModal = () => {
    fetchData();
    setAddModalOpen(false);
  };

  const headCells = [
    {
      id: "Name",
      numeric: false,
      disablePadding: true,
      label: "Name",
    },
    {
      id: "Variant",
      numeric: true,
      disablePadding: false,
      label: "Variant",
    },
    {
      id: "Icon",
      numeric: true,
      disablePadding: false,
      label: "Icon",
    },
  ];

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
      await axios.delete(`api/menus/${selectedId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setIsloading(false);
      return true;
    } catch (error) {
      setIsloading(false);
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
      fetchData();
      setTimeout(() => {
        setOpenSnackBar(false);
      }, 2000);
    }
  };
  return (
    <>
      <HeaderFilter
        searchExist
        search={search}
        button={"Add"}
        buttonClick={handleOpenAddModal}
        seachChange={(val) => setSearch(val.target.value)}
      />
      <EnhancedTable
        rows={rows}
        headCells={headCells}
        toolbar={["View", "Edit", "Delete"]}
        onView={handleOpenViewModal}
        onDelete={handleOpenDeleteModal}
        onEdit={handleOpenEditModal}
      />
      {isAddModalOpen && (
        <AddMenuModal
          cancelFcn={handleCloseAddModal}
          saveFcn={() => handleAddSnackBar("Menu Added", handleCloseAddModal)}
          closeModal={handleCloseAddModal}
          title={"Add Menu"}
          type={"Save"}
          withCancel={true}
        />
      )}
      {isEditModalOpen && (
        <EditMenuModal
          cancelFcn={handleCloseEditModal}
          saveFcn={() =>
            handleAddSnackBar("Menu Updated", handleCloseEditModal)
          }
          closeModal={handleCloseEditModal}
          title={"Edit Menu"}
          type={"Save"}
          withCancel={true}
          data={data.find((elem) => elem.id === selectedId)}
        />
      )}
      {isViewModalOpen && (
        <ViewMenuModal
          cancelFcn={handleCloseViewModal}
          saveFcn={handleCloseViewModal}
          closeModal={handleCloseViewModal}
          title={"View Menu Info"}
          type={"Close"}
          withCancel={false}
          data={data.find((elem) => elem.id === selectedId)}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          cancelFcn={handleCloseDeleteModal}
          saveFcn={() => handleDeleteSnackBar("Item Deleted Successfully")}
          closeModal={handleCloseDeleteModal}
          title={"Delete User"}
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
