import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";
import { formatDate } from "../../../utils";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import UseFetchData from "../../../shared/useFetchData";

export default function ExitCustomerTAB() {
  const [search, setSearch] = useState();
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState();
  const auth = useContext(AuthContext);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const handleAddSnackBar = () => {
    setSnackMessage("Status Updated");
    setOpenSnackBar(true);
    refetch();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
  const horizontal = "center";
  const vertical = "top";
  const getFilteredURL = () => {
    let urlapi = "api/CustomerTrips/status/dispatched?";

    if (search?.length) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") + "search=" + search;
    }

    return urlapi;
  };
  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), [search]);

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
      id: "Exit",
      numeric: true,
      disablePadding: false,
      label: "Exit",
    },
  ];

  const Buttons = ({ id }) => {
    return (
      <IconButton
        onClick={() => submitEnterGate(id)}
        color="primary"
        className="text-white bg-[#3B81F6] hover:text-[#3B81F6] hover:bg-white rounded-none text-sm"
      >
        Exit Customer
      </IconButton>
    );
  };

  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      ID: elem.id,
      TripDate: formatDate(elem.approvalDateTime),
      VehiclePlateNumber: elem.vehicle?.plateNumber,
      DriverName: elem.driver?.name,
      Status: elem.status?.name,
      Exit: <Buttons id={elem.id} />,
    };
  });

  const submitEnterGate = async (id) => {
    setError(null);
    try {
      const response = await axios.put(
        `/api/CustomerTrips/${id}/exit-gate`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      handleAddSnackBar();
    } catch (error) {
      if (error.request?.response) {
        setError(JSON.parse(error.request.response).title);
      } else setError("Error");
    }
  };

  return (
    <>
      <HeaderFilter
        searchExist
        search={search}
        seachChange={(val) => setSearch(val.target.value)}
        searchPlaceHolder={"Number, Drive Name Or Vehicle PlateNumber"}
      />
      {error && (
        <div className="mb-10">
          <span className="font-semibold text-red-500 text-xl ">{error}</span>
        </div>
      )}

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
