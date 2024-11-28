import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import AddDriverModal from "../Modals/AddDriverModal";
import DeleteModal from "../../../components/DeleteModal";
import EditDriverModal from "../Modals/EditDriverModal";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";
import { Snackbar, SnackbarContent } from "@mui/material";
import UseFetchData from "../../../shared/useFetchData";

export default function DriverTAB() {
  const [search, setSearch] = useState();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const auth = useContext(AuthContext);
  const [selectedId, setSelectedId] = useState(null);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const horizontal = "center";
  const vertical = "top";
  const [error, setError] = useState();
  const getFilteredURL = () => {
    let urlapi = "api/CustomerDrivers?";

    if (search?.length) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") + "search=" + search;
    }

    return urlapi;
  };

  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), [search]);

  const handleAddSnackBar = (message, closeFCN) => {
    setSnackMessage(message);
    setOpenSnackBar(true);
    closeFCN();
    refetch();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };
  const handleCloseAddModal = () => {
    setAddModalOpen(false);
  };
  const handleOpenViewModal = (id) => {
    setSelectedId(id);
    setViewModalOpen(true);
  };
  const handleCloseViewModal = () => {
    setViewModalOpen(false);
  };
  const handleOpenEditModal = (id) => {
    setSelectedId(id);
    setEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };
  const handleOpenDeleteModal = (id) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = () => {
    setError(null);

    setDeleteModalOpen(false);
  };

  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      ID: elem.id,
      DriverName: elem.name,
      DriverNumber: elem.number,
      DriverLicence: elem.license,
    };
  });

  const headCells = [
    {
      id: "ID",
      numeric: false,
      disablePadding: true,
      label: "ID",
    },
    {
      id: "DriverName",
      numeric: false,
      disablePadding: true,
      label: "Driver Name",
    },
    {
      id: "DriverNumber",
      numeric: true,
      disablePadding: false,
      label: "Driver Number",
    },
    {
      id: "DriverLicence",
      numeric: true,
      disablePadding: false,
      label: "Driver Licence",
    },
  ];

  const deleteDriver = async () => {
    try {
      await axios.delete(`api/CustomerDrivers/${selectedId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return true;
    } catch (error) {
      setError(JSON.parse(error.request.response).title);

      return false;
    }
  };
  const handleDeleteSnackBar = async (message) => {
    const isDeleted = await deleteDriver();

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
  return (
    <>
      <HeaderFilter
        searchExist
        search={search}
        seachChange={(val) => setSearch(val.target.value)}
        button={"New"}
        buttonClick={handleOpenAddModal}
        searchPlaceHolder={"Driver Name or Number"}
      />
      <EnhancedTable
        rows={rows || []}
        headCells={headCells}
        toolbar={["View", "Edit", "Delete"]}
        onDelete={handleOpenDeleteModal}
        onEdit={handleOpenEditModal}
        onView={handleOpenViewModal}
        loading={isLoading}
      />
      {isAddModalOpen && (
        <AddDriverModal
          cancelFcn={handleCloseAddModal}
          saveFcn={() =>
            handleAddSnackBar("Driver Added Successfully", handleCloseAddModal)
          }
          closeModal={handleCloseAddModal}
          title={"Add Driver"}
          type={"Save"}
          Editable={true}
          withCancel={true}
        />
      )}
      {isEditModalOpen && (
        <EditDriverModal
          cancelFcn={handleCloseEditModal}
          saveFcn={() =>
            handleAddSnackBar("Driver Updated", handleCloseEditModal)
          }
          closeModal={handleCloseEditModal}
          title={"Edit Driver"}
          type={"Save"}
          disabled={false}
          withCancel={true}
          data={data.find((elem) => elem.id === selectedId)}
        />
      )}
      {isViewModalOpen && (
        <EditDriverModal
          cancelFcn={handleCloseViewModal}
          saveFcn={handleCloseViewModal}
          closeModal={handleCloseViewModal}
          title={"View Driver"}
          type={"Close"}
          disabled={true}
          withCancel={false}
          data={data.find((elem) => elem.id === selectedId)}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          cancelFcn={handleCloseDeleteModal}
          saveFcn={() => handleDeleteSnackBar("Driver Deleted Successfully")}
          closeModal={handleCloseDeleteModal}
          title={"Delete Driver"}
          type={"Yes"}
          withCancel={true}
          error={error}
        />
      )}
      {openSnackBar && (
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={() => false}
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
