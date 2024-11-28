import { useContext, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import UseFetchData from "../../../shared/useFetchData";
import { AuthContext } from "../../../shared/authContext";
import { formatDate, handleExcel, handlePrint } from "../../../utils";
import UnLoadModal from "../Modals/UnLoadModal";

export default function UnloadingJubilaTab() {
  const [selectedId, setSelectedId] = useState(null);
  const auth = useContext(AuthContext);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const horizontal = "center";
  const vertical = "top";
  const getFilteredURL = () => {
    let urlapi = "api/Trips/secret-code/unloading?";
    return urlapi;
  };

  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), []);

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
        UnLoad
      </IconButton>
    );
  };

  const headCells = [
    {
      id: "ID",
      numeric: false,
      disablePadding: true,
      label: "#",
    },
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
      numeric: false,
      disablePadding: false,
      label: "Driver Name",
    },
    {
      id: "Status",
      numeric: false,
      disablePadding: false,
      label: "Status",
    },
    {
      id: "Unload",
      numeric: true,
      disablePadding: false,
      label: "Unload",
    },
  ];
  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      ID: elem.id,
      TripDate: formatDate(elem.date),
      VehiclePlateNumber: elem.vehicle?.vehiclePlateNumber,
      DriverName: elem.driver?.driverName,
      Status: elem.masterTripStatus?.name,
      Unload: <Buttons id={elem.id} />,
    };
  });
  return (
    <>
      <HeaderFilter
        /*  print={true}
        onPrint={() =>
          handlePrint(
            "api/Trips/material-receiving-report",
            `Material-Receiving-report-${formatDate(new Date())}.pdf`,
            auth
          )
        } */
        export={true}
        onExport={() =>
          handleExcel(
            "api/Trips/material-receiving-report-excel",
            `Material-Receiving-excel-report-${formatDate(new Date())}.xlsx`,
            auth
          )
        }
      />
      <EnhancedTable
        rows={rows || []}
        headCells={headCells}
        loading={isLoading}
      />
      {isLoadModalOpen && (
        <UnLoadModal
          cancelFcn={() => setIsLoadModalOpen(false)}
          saveFcn={handleButtontSnackBar}
          closeModal={() => setIsLoadModalOpen(false)}
          title={"UnLoad"}
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
