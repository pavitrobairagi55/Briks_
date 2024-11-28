import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import AddVehicleModal from "../Modals/AddVehicleModal";
import DeleteModal from "../../../components/DeleteModal";
import EditVehicleModal from "../Modals/EditVehicleModal";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";
import { Snackbar, SnackbarContent } from "@mui/material";
import UseFetchData from "../../../shared/useFetchData";
export default function VehicleTAB() {
  const [search, setSearch] = useState();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const auth = useContext(AuthContext);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [error, setError] = useState();
  const horizontal = "center";
  const vertical = "top";
  const getFilteredURL = () => {
    let urlapi = "api/CustomerVehicles?";

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

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };
  const handleCloseAddModal = () => {
    setAddModalOpen(false);
  };

  const deleteVehicle = async () => {
    try {
      await axios.delete(`api/CustomerVehicles/${selectedId}`, {
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
    const isDeleted = await deleteVehicle();

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
  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      VehiclePlateNumber: elem.plateNumber,
      VehicleEnglishName: elem.nameInEnglish,
      ChassisNumber: elem.chassisNumber,
      VehicleColorEnglish: elem.colorInEnglish,
    };
  });

  const headCells = [
    {
      id: "VehiclePlateNumber",
      numeric: false,
      disablePadding: true,
      label: "Vehicle Plate Number",
    },
    {
      id: "VehicleEnglishName",
      numeric: true,
      disablePadding: false,
      label: "Vehicle English Name",
    },
    {
      id: "ChassisNumber",
      numeric: true,
      disablePadding: false,
      label: "Chassis Number",
    },
    {
      id: "VehicleColorEnglish",
      numeric: true,
      disablePadding: false,
      label: "Vehicle Color English",
    },
  ];

  return (
    <>
      <HeaderFilter
        searchExist
        search={search}
        seachChange={(val) => setSearch(val.target.value)}
        button={"New"}
        buttonClick={handleOpenAddModal}
        searchPlaceHolder={"Vehicle Plate Number"}
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
      {isEditModalOpen && (
        <EditVehicleModal
          cancelFcn={handleCloseEditModal}
          saveFcn={() =>
            handleAddSnackBar(
              "Vehicle Updated Successfully",
              handleCloseEditModal
            )
          }
          closeModal={handleCloseEditModal}
          title={"Edit Vehicle"}
          type={"Save"}
          disabled={false}
          withCancel={true}
          data={data.find((elem) => elem.id === selectedId)}
        />
      )}
      {isViewModalOpen && (
        <EditVehicleModal
          cancelFcn={handleCloseViewModal}
          saveFcn={handleCloseViewModal}
          closeModal={handleCloseViewModal}
          title={"View Vehicle"}
          type={"Close"}
          disabled={true}
          withCancel={false}
          data={data.find((elem) => elem.id === selectedId)}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          cancelFcn={handleCloseDeleteModal}
          saveFcn={() => handleDeleteSnackBar("Vehicle Deleted Successfully")}
          closeModal={handleCloseDeleteModal}
          title={"Delete Customer Order"}
          type={"Yes"}
          withCancel={true}
          error={error}
        />
      )}

      {isAddModalOpen && (
        <AddVehicleModal
          cancelFcn={handleCloseAddModal}
          saveFcn={() =>
            handleAddSnackBar("Vehicle Added Successfully", handleCloseAddModal)
          }
          closeModal={handleCloseAddModal}
          title={"Add Vehicle"}
          type={"Save"}
          Editable={true}
          withCancel={true}
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
