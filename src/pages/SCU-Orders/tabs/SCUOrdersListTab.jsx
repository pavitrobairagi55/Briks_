import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import ApproveModal from "../Modals/ApproveModal";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";
import { formatDate } from "../../../utils";
import UseFetchData from "../../../shared/useFetchData";

export default function SCUOrdersListTab() {
  const [search, setSearch] = useState();
  const [date, setDate] = useState();
  const [selectValue, setSelectValue] = useState();
  const [isApproveModalOpen, setApproveModalOpen] = useState(false);
  const [statusList, setStatusList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const auth = useContext(AuthContext);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const StatusList = {
    All: "All",
    Pending: "Pending",
    Accepted: "Accepted",
    Rejected: "Rejected",
    Rescheduled: "Rescheduled",
  };
  const selectOption = [
    { id: StatusList.All, value: StatusList.All },
    { id: StatusList.Pending, value: StatusList.Pending },
    { id: StatusList.Accepted, value: StatusList.Accepted },
    { id: StatusList.Rejected, value: StatusList.Rejected },
    { id: StatusList.Rescheduled, value: StatusList.Rescheduled },
  ];
  const getFilteredURL = () => {
    let urlapi = "api/CustomerTrips?";

    if (search?.length) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") + "search=" + search;
    }
    if (date?.length === 2 && date[0] && date[1]) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") +
        "From=" +
        date[0] +
        "&To=" +
        date[1];
    }
    if (selectValue?.length && selectValue !== StatusList.All) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") +
        "status=" +
        selectValue;
    }
    return urlapi;
  };
  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), [
    date,
    search,
    selectValue,
  ]);

  const handleAddSnackBar = () => {
    setSnackMessage("Status Updated");
    setOpenSnackBar(true);
    setApproveModalOpen(false);
    refetch();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
  const horizontal = "center";
  const vertical = "top";

  const handleOpenApproveModal = (id) => {
    setSelectedId(id);
    setApproveModalOpen(true);
  };
  const handleCloseApproveModal = () => {
    setApproveModalOpen(false);
  };

  const updateDates = (newDate1, newDate2) => {
    setDate([newDate1, newDate2]);
  };

  const headCells = [
    {
      id: "ID",
      numeric: false,
      disablePadding: true,
      label: "Trip ID",
    },
    {
      id: "CustomerName",
      numeric: true,
      disablePadding: false,
      label: "Customer Name",
    },
    {
      id: "CONumber",
      numeric: true,
      disablePadding: false,
      label: "CO Number",
    },
    {
      id: "Priority",
      numeric: true,
      disablePadding: false,
      label: "Priority",
    },
    {
      id: "Product",
      numeric: true,
      disablePadding: false,
      label: "Product",
    },
    {
      id: "TripApproveDate",
      numeric: true,
      disablePadding: false,
      label: "Trip Approve Date",
    },
    {
      id: "ExpectedtripDate",
      numeric: true,
      disablePadding: false,
      label: "Expected trip Date",
    },
    {
      id: "VehiclePlateNumber",
      numeric: true,
      disablePadding: false,
      label: "Vehicle Plate Number",
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
      id: "Dispatch",
      numeric: true,
      disablePadding: false,
      label: "Dispatch",
    },
  ];
  const Buttons = ({ id, title, openModalFCN, status }) => {
    return (
      <IconButton
        disabled={status !== "pending"}
        onClick={() => openModalFCN(id)}
        className="text-white bg-[#F59E0B] hover:text-[#F59E0B] hover:bg-white rounded-2xl text-lg"
      >
        {title}
      </IconButton>
    );
  };

  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      ID: elem.id,
      CustomerName: elem.customerFirstname + " " + elem.customerLastname,
      CONumber: elem.customerOrderId,
      Product: elem.product,
      Priority: elem.orderPriority,
      VehiclePlateNumber: elem.vehicle.plateNumber,
      DriverName: elem.driver.name,
      Status: elem.status.name,
      ExpectedtripDate: formatDate(elem.expectedTripDate),
      TripApproveDate: formatDate(elem.approvalDateTime),
      Dispatch: (
        <Buttons
          id={elem.id}
          title={"Approval"}
          status={elem.status.secretCode}
          openModalFCN={handleOpenApproveModal}
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
        selectExists
        selectValue={selectValue}
        date={date}
        dateChange={updateDates}
        dateExist
        selectChange={(val) => setSelectValue(val.target.value)}
        selectOptions={selectOption}
      />
      <EnhancedTable
        rows={rows || []}
        headCells={headCells}
        loading={isLoading}
      />
      {isApproveModalOpen && (
        <ApproveModal
          cancelFcn={handleCloseApproveModal}
          saveFcn={handleAddSnackBar}
          closeModal={handleCloseApproveModal}
          title={"SCU Orders Form"}
          type={"Approve"}
          Editable={false}
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
