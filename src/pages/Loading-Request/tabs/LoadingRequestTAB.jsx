import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import DispatchModal from "../Modals/DispatchModal";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import { Print } from "@mui/icons-material";
import { formatDate, handlePrint } from "../../../utils";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";
import LoadingQrCodeModal from "../Modals/LoadingQrCodeModal";
import UseFetchData from "../../../shared/useFetchData";

export default function LoadingRequestTAB() {
  const [search, setSearch] = useState();
  const [selectValue, setSelectValue] = useState();
  const [error, setError] = useState(" ");
  const [isDispatchModalOpen, setDispatchModalOpen] = useState(false);
  const auth = useContext(AuthContext);

  const [isOpenQrCodeModal, setIsOpenQrCodeModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const getFilteredURL = () => {
    let urlapi = "api/customerTrips?";
    if (selectValue?.length > 0 && selectValue !== "null") {
      urlapi = `api/customerTrips/status/${selectValue}?`;
    }

    if (search?.length) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") + "search=" + search;
    }

    return urlapi;
  };
  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), [
    selectValue,
    search,
  ]);

  const handleAddSnackBar = (message, handleSaveFCN) => {
    setSnackMessage(message);
    setOpenSnackBar(true);
    handleSaveFCN();
    refetch();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
  const horizontal = "center";
  const vertical = "top";

  const handleOpenQrCode = (id) => {
    setSelectedId(id);
    setIsOpenQrCodeModal(true);
  };
  const handleOpenDispatchModal = (id) => {
    setError(null);

    setSelectedId(id);
    setDispatchModalOpen(true);
  };
  const handleCloseDispatchModal = () => {
    setDispatchModalOpen(false);
  };

  const headCells = [
    {
      id: "TripNo",
      numeric: false,
      disablePadding: true,
      label: "Trip No",
    },
    {
      id: "CoNumber",
      numeric: true,
      disablePadding: false,
      label: "CO Number",
    },
    {
      id: "TripDate",
      numeric: true,
      disablePadding: false,
      label: "TripDate",
    },
    {
      id: "VehiculePlateNumber",
      numeric: true,
      disablePadding: false,
      label: "Vehicule Plate Number",
    },

    {
      id: "DriverName",
      numeric: true,
      disablePadding: false,
      label: "Driver Name",
    },
    {
      id: "QRCode",
      numeric: true,
      disablePadding: false,
      label: "QRCode",
    },
    {
      id: "LoadingRequest",
      numeric: true,
      disablePadding: false,
      label: "Loading Request",
    },
    {
      id: "DispatchPaper",
      numeric: true,
      disablePadding: false,
      label: "Dispatch Paper",
    },
    {
      id: "Status",
      numeric: true,
      disablePadding: false,
      label: "Status",
    },
    {
      id: "Dispatch",
      numeric: true,
      disablePadding: false,
      label: "Dispatch",
    },
    {
      id: "Completed",
      numeric: true,
      disablePadding: false,
      label: "Completed",
    },
  ];
  const status = [
    { id: "null", value: "All" },
    { id: "pending", value: "Pending" },
    { id: "accepted", value: "Accepted" },
    { id: "rescheduled", value: "Rescheduled" },
    { id: "rejected", value: "Rejected" },
    { id: "enterGate", value: "EnterGate" },
    { id: "loading", value: "Loading" },
    { id: "dispatched", value: "Dispatched" },
    { id: "completed", value: "Completed" },
  ];

  const PrintButton = ({ id, status }) => {
    return (
      <IconButton
        disabled={status !== "dispatched" && status !== "completed"}
        onClick={() =>
          handlePrint(
            `api/CustomerTrips/${id}/dispatch-note`,
            `dispatch-note-${id}.pdf`,
            auth
          )
        }
        color="primary"
        className="text-white bg-[#3B81F6] hover:text-[#3B81F6] hover:bg-white"
      >
        <Print />
      </IconButton>
    );
  };
  const PrintLoading = ({ id, status }) => {
    return (
      <IconButton
        disabled={
          status !== "dispatched" &&
          status !== "loading" &&
          status !== "completed"
        }
        onClick={() =>
          handlePrint(
            `api/CustomerTrips/${id}/loading-request`,
            `loading-request-${id}.pdf`,
            auth
          )
        }
        color="primary"
        className="text-white bg-[#3B81F6] hover:text-[#3B81F6] hover:bg-white"
      >
        <Print />
      </IconButton>
    );
  };

  const ButtonsDispatch = ({ id, status, openModalFCN }) => {
    return (
      <IconButton
        disabled={status !== "enterGate"}
        onClick={() => openModalFCN(id)}
        className="text-white bg-[#F59E0B] hover:text-[#F59E0B] hover:bg-white rounded-2xl text-sm"
      >
        {status === "dispatched" ? "Dispatched" : "Dispatch"}
      </IconButton>
    );
  };
  const ButtonsCompleted = ({ id, status }) => {
    return (
      <IconButton
        disabled={status !== "enterGate"}
        onClick={() => handleComplete(id)}
        className="text-white bg-[#3B81F6] hover:text-[#3B81F6] hover:bg-white rounded-2xl text-sm"
      >
        Complete
      </IconButton>
    );
  };

  const handleComplete = async (id) => {
    setError(null);
    try {
      await axios.put(
        `api/CustomerTrips/${id}/complete-dispatch`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      refetch();
    } catch (error) {
      if (error.request.response) {
        setError(JSON.parse(error.request.response).title);
      } else setError("Error completing Trip");
    }
  };
  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      TripNo: elem.id,
      CoNumber: elem.customerOrderId,
      TripDate: elem.approvalDateTime ? formatDate(elem.approvalDateTime) : "",
      VehiculePlateNumber: elem.vehicle.plateNumber,
      DriverName: elem.driver.name,
      QRCode: (
        <button onClick={() => handleOpenQrCode(elem.id)}>
          <i className="fa fa-qrcode text-2xl text-blue-400 mr-4 hover:text-blue-600"></i>
        </button>
      ),
      DispatchPaper: (
        <PrintButton id={elem.id} status={elem.status?.name?.toLowerCase()} />
      ),
      LoadingRequest: (
        <PrintLoading id={elem.id} status={elem.status?.name?.toLowerCase()} />
      ),
      Status: elem.status.name,
      Dispatch: (
        <ButtonsDispatch
          status={elem.status.secretCode}
          id={elem.id}
          openModalFCN={() => handleOpenDispatchModal(elem.id)}
        />
      ),
      Completed: (
        <ButtonsCompleted status={elem.status.secretCode} id={elem.id} />
      ),
    };
  });

  return (
    <>
      <span className="font-semibold text-red-500">{error} </span>

      <HeaderFilter
        searchExist
        search={search}
        seachChange={(val) => setSearch(val.target.value)}
        selectExists
        selectValue={selectValue}
        selectChange={(val) => setSelectValue(val.target.value)}
        selectOptions={status}
        searchPlaceHolder={"Number, Vehicle Plate Number or Driver Name"}
      />
      <EnhancedTable
        rows={rows || []}
        headCells={headCells}
        loading={isLoading}
      />
      {isDispatchModalOpen && (
        <DispatchModal
          cancelFcn={handleCloseDispatchModal}
          saveFcn={() =>
            handleAddSnackBar("Dispatched", handleCloseDispatchModal)
          }
          closeModal={handleCloseDispatchModal}
          title={"Dispatch Office Form"}
          type={"Dispatch"}
          withCancel={true}
          data={data.find((elem) => elem.id === selectedId)}
        />
      )}
      {isOpenQrCodeModal && (
        <LoadingQrCodeModal
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
