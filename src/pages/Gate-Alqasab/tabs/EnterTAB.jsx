import { useContext, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import UseFetchData from "../../../shared/useFetchData";
import { AuthContext } from "../../../shared/authContext";
import { formatDate } from "../../../utils";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import axios from "../../../api/axios";

export default function EnterTAB() {
  const [search, setSearch] = useState();
  const [selectedId, setSelectedId] = useState(null);
  const auth = useContext(AuthContext);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const getFilteredURL = () => {
    let urlapi = "api/Trips/secret-code/toAlqasab?";

    if (search?.length) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") + "Search=" + search;
    }

    return urlapi;
  };

  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), [search]);

  const handleButtontSnackBar = async (id) => {
    await axios.put(
      `api/Trips/enter-qasab/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    setSnackMessage("Status Updated");
    setOpenSnackBar(true);
    refetch();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
  const horizontal = "center";
  const vertical = "top";
  const headCells = [
    {
      id: "ID",
      numeric: false,
      disablePadding: true,
      label: "#ID",
    },
    {
      id: "TripDate",
      numeric: true,
      disablePadding: false,
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
      id: "Enter",
      numeric: true,
      disablePadding: false,
      label: "Enter",
    },
  ];
  const Buttons = ({ id }) => {
    return (
      <IconButton
        onClick={() => handleButtontSnackBar(id)}
        color="primary"
        className="text-white bg-[#3B81F6] hover:text-[#3B81F6] hover:bg-white rounded-none text-sm"
      >
        Enter
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
      Enter: <Buttons id={elem.id} />,
    };
  });
  return (
    <>
      <HeaderFilter
        searchExist
        search={search}
        seachChange={(val) => setSearch(val.target.value)}
      />
      <EnhancedTable rows={rows || []} headCells={headCells} />
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