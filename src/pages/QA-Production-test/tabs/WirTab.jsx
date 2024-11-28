import { useContext, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import DeleteModal from "../../../components/DeleteModal";
import { Snackbar, SnackbarContent } from "@mui/material";
import { AuthContext } from "../../../shared/authContext";
import UseFetchData from "../../../shared/useFetchData";
import AddMirAthelModal from "../modals/AddMirAthelModal";
import AddWirModal from "../modals/AddWirModal";
import { formatDate } from "../../../utils";
import { APP_URL, VITE_FILE_URL } from "../../../envirement";

export default function WirTab() {
  const auth = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState();
  const [selectedId, setSelectedId] = useState(null);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [search, setSearch] = useState();
  const [date, setDate] = useState();
  const horizontal = "center";
  const vertical = "top";
  const getFilteredURL = () => {
    let urlapi = "api/AthelWoodApprovalWIR?";

    if (search?.length) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") + "Search=" + search;
    }
    if (date?.length === 2 && date[0] && date[1]) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") +
        "From=" +
        date[0] +
        "&To=" +
        date[1];
    }
    return urlapi;
  };

  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), [
    date,
    search,
  ]);
  const updateDates = (newDate1, newDate2) => {
    setDate([newDate1, newDate2]);
  };
  const headCells = [
    {
      id: "ID",
      numeric: false,
      disablePadding: true,
      label: "ID",
    },
    {
      id: "WirNumber",
      numeric: false,
      disablePadding: true,
      label: "Wir Number",
    },
    {
      id: "SerialNumber",
      numeric: true,
      disablePadding: false,
      label: "Serial Number",
    },
    {
      id: "Quantity",
      numeric: true,
      disablePadding: false,
      label: "Quantity",
    },
    {
      id: "Date",
      numeric: true,
      disablePadding: false,
      label: "Date",
    },
    {
      id: "MirCopy",
      numeric: true,
      disablePadding: false,
      label: "MirCopy",
    },
    {
      id: "WirCopy",
      numeric: true,
      disablePadding: false,
      label: "Wir Copy",
    },
  ];
  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      ID: elem.id,
      WirNumber: elem.wirNumber,
      SerialNumber: elem.serialNumberCovered,
      Quantity: elem.approvedQuantity,
      Date: formatDate(elem.dateSubmitted),
      MirCopy: (
        <a
          href={VITE_FILE_URL + elem.mirCopy.path}
          className=" text-blue-400 mr-4 hover:text-blue-600"
          target="_blank"
        >
          View MirCopy
        </a>
      ),
      WirCopy: (
        <a
          href={VITE_FILE_URL + elem.wirCopy.path}
          className=" text-blue-400 mr-4 hover:text-blue-600"
          target="_blank"
        >
          View WirCopy
        </a>
      ),
    };
  });
  const handleSubmitAddModal = () => {
    setSnackMessage(" Added Successfully");
    setOpenSnackBar(true);
    setIsModalOpen(false);
    refetch();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
  return (
    <>
      <HeaderFilter
        button="New"
        buttonClick={() => setIsModalOpen(true)}
        searchExist
        search={search}
        seachChange={(val) => setSearch(val.target.value)}
        date={date}
        dateChange={updateDates}
        dateExist
      />
      <EnhancedTable
        rows={rows || []}
        headCells={headCells}
        loading={isLoading}
      />
      {isModalOpen && (
        <AddWirModal
          title="Add "
          withCancel
          cancelFcn={() => setIsModalOpen(false)}
          type="Add"
          closeModal={() => setIsModalOpen(false)}
          saveFcn={handleSubmitAddModal}
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
