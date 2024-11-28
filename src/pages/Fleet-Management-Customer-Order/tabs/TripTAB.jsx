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

export default function TripTAB() {
  const [search, setSearch] = useState();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const auth = useContext(AuthContext);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [error, setError] = useState();
  const getFilteredURL = () => {
    let urlapi = "api/CustomerTrips?";

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
      id: "CO",
      numeric: true,
      disablePadding: false,
      label: "CO",
    },
    {
      id: "Product",
      numeric: true,
      disablePadding: false,
      label: "Product",
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
      id: "ExpectedDate",
      numeric: true,
      disablePadding: false,
      label: "Expected Date",
    },
    {
      id: "ApprovedDate",
      numeric: true,
      disablePadding: false,
      label: "Approved Date",
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

  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      ID: elem.id,
      CO: elem.customerOrderId,
      Product: elem.product,
      Vehicle: elem.vehicle.plateNumber,
      DriverName: elem.driver.name,
      Status: elem.status.name,
      ExpectedDate: formatDate(elem.expectedTripDate),
      ApprovedDate: formatDate(elem.approvalDateTime),
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
      await axios.delete(`api/CustomerTrips/${selectedId}`, {
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
