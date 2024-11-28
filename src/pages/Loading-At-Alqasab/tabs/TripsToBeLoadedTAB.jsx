import { useContext, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import UseFetchData from "../../../shared/useFetchData";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import { formatDate } from "../../../utils";
import EnterLoadModal from "../Modals/EnterLoadModal";

export default function TripsToBeLoadedTAB() {
  const [selectedId, setSelectedId] = useState(null);
  const auth = useContext(AuthContext);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const horizontal = "center";
  const vertical = "top";
  const getFilteredURL = () => {
    let urlapi = "api/Trips/secret-code/loading?";
    return urlapi;
  };

  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), []);

  const headCells = [
    {
      id: "TripDate",
      numeric: false,
      disablePadding: true,
      label: "Trip Date",
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
      id: "Load",
      numeric: true,
      disablePadding: false,
      label: "Load",
    },
  ];
  const handleButtontSnackBar = () => {
    setSnackMessage("Status Updated");
    setIsLoadModalOpen(false);
    setOpenSnackBar(true);
    refetch();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
  const handleLoadModal = (id) => {
    setSelectedId(id);
    setIsLoadModalOpen(true);
  };
  const Buttons = ({ id }) => {
    return (
      <IconButton
        onClick={() => handleLoadModal(id)}
        color="primary"
        className="text-white bg-[#3B81F6] hover:text-[#3B81F6] hover:bg-white rounded-none text-sm"
      >
        Load
      </IconButton>
    );
  };
  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      ID: elem.id,
      TripDate: formatDate(elem.date),
      VehiclePlateNumber: elem.vehicle?.vehiclePlateNumber,
      DriverName: elem.driver?.driverName,
      Status: elem.masterTripStatus?.name,
      Load: <Buttons id={elem.id} />,
    };
  });
  return (
    <>
      <HeaderFilter />
      <EnhancedTable
        rows={rows || []}
        headCells={headCells}
        loading={isLoading}
      />
      {isLoadModalOpen && (
        <EnterLoadModal
          cancelFcn={() => setIsLoadModalOpen(false)}
          saveFcn={handleButtontSnackBar}
          closeModal={() => setIsLoadModalOpen(false)}
          title={"Load"}
          type={"Save"}
          withCancel={true}
          data={data.find(
            (elem) => elem.id.toString() === selectedId.toString()
          )}
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
