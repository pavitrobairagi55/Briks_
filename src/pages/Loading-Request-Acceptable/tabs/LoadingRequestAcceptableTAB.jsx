import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import ShowLoadingRequestModal from "../Modals/ShowLoadingRequestModal";
import ShowLoadingRequestApproveModal from "../Modals/ShowLoadingRequestApproveModal";
import { IconButton } from "@mui/material";
import { Print } from "@mui/icons-material";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";
import { formatDate, handlePrint } from "../../../utils";
import UseFetchData from "../../../shared/useFetchData";

export default function LoadingRequestAcceptableTAB() {
  const [search, setSearch] = useState();
  const [isShowModalOpen, setShowModalOpen] = useState(false);
  const [isShowModalApporveOpen, setShowModalApporveOpen] = useState(false);
  const [approvalData, setApprovalData] = useState();
  const [selectValue, setSelectValue] = useState("dispatched");

  const auth = useContext(AuthContext);
  const [selectedId, setSelectedId] = useState(null);
  /*   const getFilteredURL = () => {
    let urlapi = "api/customerTrips/status/dispatched?";

    if (search?.length) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") + "search=" + search;
    }
    return urlapi;
  };
  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), [search]); */
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
  const handleOpenShowApporveModal = () => {
    handleCloseShowModal();
    setShowModalApporveOpen(true);
  };
  const handleCloseShowApporveModal = () => {
    setShowModalApporveOpen(false);
  };

  const handleCloseApprove = (id) => {
    setShowModalApporveOpen(false);
    handleOpenShowModal(id);
  };
  const handleOpenShowModal = (id) => {
    setSelectedId(id);
    setShowModalOpen(true);
  };
  const handleCloseShowModal = () => {
    setShowModalOpen(false);
  };
  const handleSubmithowModal = () => {
    setShowModalOpen(false);
    refetch();
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
      id: "Product",
      numeric: true,
      disablePadding: false,
      label: "Product",
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
    /* 
    {
      id: "Print",
      numeric: true,
      disablePadding: false,
      label: "Print",
    }, */
    {
      id: "Status",
      numeric: true,
      disablePadding: false,
      label: "Status",
    },
    {
      id: "Apporval",
      numeric: true,
      disablePadding: false,
      label: "Apporval",
    },
  ];
  const PrintButton = ({ id, status }) => {
    return (
      <IconButton
        disabled={status !== "loading" && status !== "completed"}
        onClick={() =>
          handlePrint(
            `api/CustomerTrips/${id}/dispatch-note`,
            `dispatch-note-acceptable-${id}.pdf`,
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
  const ButtonsDispatch = ({ id, title, openModalFCN }) => {
    return (
      <IconButton
        onClick={() => openModalFCN(id)}
        className="text-white bg-[#F59E0B] hover:text-[#F59E0B] hover:bg-white rounded-2xl text-sm"
      >
        {title}
      </IconButton>
    );
  };

  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      TripNo: elem.id,
      Product: elem.product,
      Status: elem.status.name,
      CoNumber: elem.customerOrderId,
      TripDate: elem.approvalDateTime ? formatDate(elem.approvalDateTime) : "",
      VehiculePlateNumber: elem.vehicle.plateNumber,
      DriverName: elem.driver.name,
      Print: (
        <PrintButton id={elem.id} status={elem.status?.name?.toLowerCase()} />
      ),
      Apporval: (
        <ButtonsDispatch
          id={elem.id}
          title={"show"}
          openModalFCN={() => handleOpenShowModal(elem.id)}
        />
      ),
    };
  });

  return (
    <>
      <HeaderFilter
        searchExist
        search={search}
        seachChange={(val) => setSearch(val.target.value)}
        searchPlaceHolder={"Number, Vehicle Plate Number or Driver Name"}
        selectExists
        selectValue={selectValue}
        selectChange={(val) => setSelectValue(val.target.value)}
        selectOptions={status}
      />
      <EnhancedTable
        rows={rows || []}
        headCells={headCells}
        loading={isLoading}
      />
      {isShowModalOpen && (
        <ShowLoadingRequestModal
          cancelFcn={handleCloseShowModal}
          saveFcn={handleSubmithowModal}
          closeModal={handleSubmithowModal}
          title={"Show Loading Request"}
          type={"close"}
          withCancel={false}
          openSecondFCN={handleOpenShowApporveModal}
          selectedId={selectedId}
          setApprovalData={setApprovalData}
        />
      )}
      {isShowModalApporveOpen && (
        <ShowLoadingRequestApproveModal
          cancelFcn={handleCloseApprove}
          saveFcn={handleCloseApprove}
          closeModal={handleCloseApprove}
          title={"Loading Request Approve"}
          type={"Approve"}
          withCancel={false}
          data={approvalData}
          selectedId={selectedId}
        />
      )}
    </>
  );
}
