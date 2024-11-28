import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import UseFetchData from "../../../shared/useFetchData";
import { formatDate } from "../../../utils";
import AddStorageModal from "../Modals/AddStorageModal";

export default function CollectionRequestTab() {
  const [search, setSearch] = useState();
  const [date, setDate] = useState();
  const auth = useContext(AuthContext);

  const [selectValue, setSelectValue] = useState();
  const [isStorageModalOpen, setStorageModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const horizontal = "center";
  const vertical = "top";
  const getFilteredURL = () => {
    let urlapi = "api/Collection?";

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
    if (selectValue?.length) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") +
        "Status=" +
        selectValue;
    }
    return urlapi;
  };

  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), [
    date,
    search,
    selectValue,
  ]);
  const handleOpenStorageModal = (id) => {
    setSelectedId(id);
    setStorageModalOpen(true);
  };
  const handleCloseStorageModal = () => {
    setStorageModalOpen(false);
  };

  const updateDates = (newDate1, newDate2) => {
    setDate([newDate1, newDate2]);
  };
  const status = [
    { id: "isAccepted", value: "Approved" },
    { id: "isRejected", value: "Rejected" },
    { id: "isRejected", value: "Pending" },
  ];

  const headCells = [
    {
      id: "CollectionReq",
      numeric: false,
      disablePadding: true,
      label: "Collection Req",
    },
    {
      id: "CreatedDate",
      numeric: true,
      disablePadding: false,
      label: "Created Date",
    },
    {
      id: "BricksQt",
      numeric: true,
      disablePadding: false,
      label: "Bricks Qt",
    },
    {
      id: "Status",
      numeric: true,
      disablePadding: false,
      label: "Status",
    },
    {
      id: "Storage",
      numeric: true,
      disablePadding: false,
      label: "Storage",
    },
  ];

  const Buttons = ({ id, openModalFCN, status }) => {
    return (
      <IconButton
        disabled={status?.toLowerCase() !== "accepted"}
        onClick={() => openModalFCN(id)}
        className="text-white bg-[#3B81F6] hover:text-[#3B81F6] hover:bg-white rounded-2xl text-sm px-3"
      >
        Add Storage
      </IconButton>
    );
  };

  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      CollectionReq: elem.id,
      CreatedDate: formatDate(elem.collectionDate),
      BricksQt: elem.bricksQt,
      Status: elem.status,
      Storage: (
        <Buttons
          id={elem.id}
          openModalFCN={handleOpenStorageModal}
          status={elem.status}
        />
      ),
    };
  });

  const handleSubmitAddStorageModal = () => {
    setSnackMessage("Added Successfully");
    setOpenSnackBar(true);
    setStorageModalOpen(false);
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
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
        selectOptions={status}
      />
      <EnhancedTable rows={rows || []} headCells={headCells} />
      {isStorageModalOpen && (
        <AddStorageModal
          cancelFcn={handleCloseStorageModal}
          saveFcn={handleSubmitAddStorageModal}
          closeModal={handleCloseStorageModal}
          title={"Storage"}
          type={"Save"}
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
