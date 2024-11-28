import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import useFetch from "../../../shared/useFetch";
import { AuthContext } from "../../../shared/authContext";
import AddModal from "../Modals/AddModal";
import { Snackbar, SnackbarContent } from "@mui/material";
import DeleteModal from "../../../components/DeleteModal";
import ViewModal from "../Modals/ViewModal";
import EditModal from "../Modals/EditModal";
import axios from "../../../api/axios";
import UseFetchData from "../../../shared/useFetchData";

export default function SupplierTab() {
  const [search, setSearch] = useState();
  const auth = useContext(AuthContext);

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [error, setError] = useState();
  const getFilteredURL = () => {
    let urlapi = "api/suppliers?";

    if (search?.length) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") + "name=" + search;
    }

    return urlapi;
  };
  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), [search]);

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
    setAddModalOpen(false);
  };

  const handleAddSnackBar = (message, handleSaveFCN) => {
    setSnackMessage(message);
    refetch();
    setOpenSnackBar(true);
    handleSaveFCN();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };

  const horizontal = "center";
  const vertical = "top";

  const headCells = [
    {
      id: "SupplierName",
      numeric: false,
      disablePadding: true,
      label: "Supplier Name",
    },
    {
      id: "Email",
      numeric: false,
      disablePadding: false,
      label: "Email",
    },
  ];
  const rows = data?.map((elem) => {
    return { id: elem.id, SupplierName: elem.name, Email: elem.email };
  });
  const handleDeleteSnackBar = async (message) => {
    const isDeleted = await deleteSupplier();

    if (isDeleted) {
      setSnackMessage(message);
      setOpenSnackBar(true);
      handleCloseDeleteModal();
      refetch();
      setTimeout(() => {
        setOpenSnackBar(false);
      }, 2000);
    }
  };
  const deleteSupplier = async () => {
    try {
      await axios.delete(`api/suppliers/${selectedId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return true;
    } catch (error) {
      setError(JSON.parse(error.request?.response).title);

      return false;
    }
  };

  return (
    <>
      <HeaderFilter
        searchExist
        search={search}
        seachChange={(val) => setSearch(val.target.value)}
        button={"Add"}
        buttonClick={handleOpenAddModal}
        searchPlaceHolder={"Supplier Name"}
      />
      <EnhancedTable
        rows={rows || []}
        headCells={headCells}
        loading={isLoading}
        toolbar={["View", "Edit", "Delete"]}
        onView={handleOpenViewModal}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
      />
      {isAddModalOpen && (
        <AddModal
          cancelFcn={handleCloseAddModal}
          saveFcn={() =>
            handleAddSnackBar("Supplier Added", handleCloseAddModal)
          }
          closeModal={handleCloseAddModal}
          title={"Add Supplier"}
          type={"Save"}
          withCancel={true}
        />
      )}
      {isViewModalOpen && (
        <ViewModal
          cancelFcn={handleCloseViewModal}
          saveFcn={handleCloseViewModal}
          closeModal={handleCloseViewModal}
          title={"View supplier Info"}
          type={"Close"}
          withCancel={false}
          selectedId={selectedId}
        />
      )}
      {isEditModalOpen && (
        <EditModal
          cancelFcn={handleCloseEditModal}
          saveFcn={() =>
            handleAddSnackBar("Supplier Updated", handleCloseEditModal)
          }
          closeModal={handleCloseEditModal}
          title={"Edit supplier Info"}
          type={"Save"}
          withCancel={true}
          selectedId={selectedId}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          cancelFcn={handleCloseDeleteModal}
          saveFcn={() => handleDeleteSnackBar("supplier Deleted Successfully")}
          closeModal={handleCloseDeleteModal}
          title={"Delete Supplier"}
          type={"Yes"}
          withCancel={true}
          error={error}
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
