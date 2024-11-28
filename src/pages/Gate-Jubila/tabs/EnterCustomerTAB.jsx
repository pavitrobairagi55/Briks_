import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import { StatusComponent } from "../../../components/statusComponent";
import { STORAGE_STATUS_ENUM } from "../../../enums";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
import { formatDate } from "../../../utils";
import UseFetchData from "../../../shared/useFetchData";

export default function EnterCustomerTAB() {
  const [search, setSearch] = useState();
  const [selectedId, setSelectedId] = useState(null);
  const auth = useContext(AuthContext);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const getFilteredURL = () => {
    let urlapi = "api/CustomerTrips/enter-gate?";

    if (search?.length) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") + "search=" + search;
    }

    return urlapi;
  };
  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), [search]);

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
        onClick={() => submitEnterGate(id)}
        color="primary"
        className="text-white bg-[#3B81F6] hover:text-[#3B81F6] hover:bg-white rounded-none text-sm"
      >
        Enter Customer
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
      Enter: <Buttons id={elem.id} />,
    };
  });

  const submitEnterGate = async (id) => {
    try {
      const response = await axios.put(
        `/api/customerTrips/${id}/enter-gate`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      handleAddSnackBar();
    } catch (error) {}
  };

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
