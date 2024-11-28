import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import { formatDate } from "../../../utils";
import UseFetchData from "../../../shared/useFetchData";

export default function EnterTAB() {
  const [search, setSearch] = useState();
  const [selectedId, setSelectedId] = useState(null);
  const auth = useContext(AuthContext);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const getFilteredURL = () => {
    let urlapi = "api/Trips/secret-code/toJubila?";

    if (search?.length) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") + "search=" + search;
    }

    return urlapi;
  };
  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), [search]);

  const handleEnterSnackBar = async (id) => {
    await axios.put(
      `api/Trips/enter-jubila/${id}`,
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
      id: "TripNo",
      numeric: false,
      disablePadding: true,
      label: "TripNo",
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
        onClick={() => handleEnterSnackBar(id)}
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
      TripNo: elem.id,
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
        searchPlaceHolder={"Number, Drive Name Or Vehicle PlateNumber"}
      />
      <EnhancedTable
        rows={rows || []}
        headCells={headCells}
        loading={isLoading}
      />
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
