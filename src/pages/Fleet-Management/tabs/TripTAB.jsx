import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import DeleteModal from "../../../components/DeleteModal";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
import { formatDate } from "../../../utils";
import { Snackbar, SnackbarContent } from "@mui/material";
import EditTripModal from "../Modals/EditTripModal";
import TripQrCodeModal from "../Modals/TripQrCodeModal";
import UseFetchData from "../../../shared/useFetchData";
import TripDetailsModal from "../Modals/TripDetailsModal";

export default function TripTAB() {
  const [search, setSearch] = useState();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const auth = useContext(AuthContext);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [error, setError] = useState();
  const getFilteredURL = () => {
    let urlapi = "api/Trips?";

    if (search?.length) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") + "search=" + search;
    }

    return urlapi;
  };
  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), [search]);

  const [isOpenQrCodeModal, setIsOpenQrCodeModal] = useState(false);
  const horizontal = "center";
  const vertical = "top";

  const handleAddSnackBar = (message, closeFCN) => {
    setSnackMessage(message);
    setOpenSnackBar(true);
    closeFCN();
    refetch();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
  const handleOpenDeleteModal = (id) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = () => {
    setError(null);
    setDeleteModalOpen(false);
  };

  const handleOpenEditModal = (id) => {
    setSelectedId(id);
    setEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };
  const headCells = [
    {
      id: "ID",
      numeric: false,
      disablePadding: true,
      label: "#ID",
    },
    {
      id: "Vehicle",
      numeric: true,
      disablePadding: false,
      label: "Vehicle",
    },
    {
      id: "DriverName",
      numeric: true,
      disablePadding: false,
      label: "Driver Name",
    },
    {
      id: "Status",
      numeric: true,
      disablePadding: false,
      label: "Status",
    },

    {
      id: "Date",
      numeric: true,
      disablePadding: false,
      label: "Date",
    },
    {
      id: "Details",
      numeric: true,
      disablePadding: false,
      label: "Details",
    },
    {
      id: "QRCode",
      numeric: true,
      disablePadding: false,
      label: "QRCode",
    },
  ];

  const handleOpenQrCode = (id) => {
    setSelectedId(id);
    setIsOpenQrCodeModal(true);
  };
  const handleOpenTripDetails = (id) => {
    setSelectedId(id);
    setIsDetailsModalOpen(true);
  };
  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      ID: elem.id,
      Vehicle: elem.vehicle.vehiclePlateNumber,
      DriverName: elem.driver.driverName,
      Status: elem.masterTripStatus.name,
      Date: formatDate(elem.date),
      Details: (
        <button onClick={() => handleOpenTripDetails(elem.id)}>
          <i className="fa fa-info-circle text-2xl text-blue-400 mr-4 hover:text-blue-600"></i>
        </button>
      ),
      QRCode: (
        <button onClick={() => handleOpenQrCode(elem.id)}>
          <i className="fa fa-qrcode text-2xl text-blue-400 mr-4 hover:text-blue-600"></i>
        </button>
      ),
    };
  });
  const handleDeleteSnackBar = async (message) => {
    const isDeleted = await deleteTrip();

    if (isDeleted) {
      setSnackMessage(message);
      setOpenSnackBar(true);
      setDeleteModalOpen(false);
      refetch();
      setTimeout(() => {
        setOpenSnackBar(false);
      }, 2000);
    }
  };
  const deleteTrip = async () => {
    try {
      await axios.delete(`api/Trips/${selectedId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return true;
    } catch (error) {
      setError(error.response?.data);

      return false;
    }
  };
  return (
    <>
      <HeaderFilter
        searchExist
        search={search}
        seachChange={(val) => setSearch(val.target.value)}
        searchPlaceHolder={"Trip Number or Vehicle Plate Number"}
      />
      <EnhancedTable
        rows={rows || []}
        headCells={headCells}
        toolbar={["Edit", "Delete"]}
        onDelete={handleOpenDeleteModal}
        onEdit={handleOpenEditModal}
        loading={isLoading}
      />
      {isDeleteModalOpen && (
        <DeleteModal
          cancelFcn={handleCloseDeleteModal}
          saveFcn={() => handleDeleteSnackBar("Trip Deleted Successfully")}
          closeModal={handleCloseDeleteModal}
          title={"Delete Customer Order"}
          type={"Yes"}
          withCancel={true}
          error={error}
        />
      )}
      {isDetailsModalOpen && (
        <TripDetailsModal
          cancelFcn={() => setIsDetailsModalOpen(false)}
          saveFcn={() => setIsDetailsModalOpen(false)}
          closeModal={() => setIsDetailsModalOpen(false)}
          title={"Trip Details"}
          type={"Close"}
          withCancel={false}
          data={data.find((elem) => elem.id === selectedId)}
        />
      )}
      {isEditModalOpen && (
        <EditTripModal
          cancelFcn={handleCloseEditModal}
          saveFcn={() =>
            handleAddSnackBar("Trip updated Successfully", handleCloseEditModal)
          }
          closeModal={handleCloseEditModal}
          title={"Edit Trip"}
          type={"Edit"}
          withCancel={true}
          data={data.find((elem) => elem.id === selectedId)}
        />
      )}
      {isOpenQrCodeModal && (
        <TripQrCodeModal
          cancelFcn={() => setIsOpenQrCodeModal(false)}
          saveFcn={() => setIsOpenQrCodeModal(false)}
          closeModal={() => setIsOpenQrCodeModal(false)}
          title={"Qr Code"}
          type={"Print"}
          withCancel={false}
          data={data.find((elem) => elem.id === selectedId)}
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
