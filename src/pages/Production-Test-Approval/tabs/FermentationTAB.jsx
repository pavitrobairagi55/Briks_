import { useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import ApproveMoldingModal from "../modals/ApproveMoldingModal";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import UseFetchData from "../../../shared/useFetchData";
import MirNotesModal from "../modals/MirNotesModal";
import { formatDate } from "../../../utils";
import ApproveFermentationModal from "../modals/ApproveFermentationModal";

export default function FermentationTAB() {
  const [error, setError] = useState();
  const [selectedId, setSelectedId] = useState(null);
  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [search, setSearch] = useState();
  const [date, setDate] = useState();
  const [selectValue, setSelectValue] = useState("");
  const horizontal = "center";
  const vertical = "top";
  const getFilteredURL = () => {
    let urlapi = "api/Fermentation?";

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

  const statusList = [
    { id: "Pending", value: "Pending" },
    { id: "Accepted", value: "Accepted" },
    { id: "Rejected", value: "Rejected" },
    { id: "Confirmed", value: "Confirmed" },
  ];
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
      id: "MixingRequest",
      numeric: false,
      disablePadding: true,
      label: "Mixing Request",
    },
    {
      id: "FermintationDate",
      numeric: true,
      disablePadding: false,
      label: "Fermintation Date",
    },
    {
      id: "StrawZone",
      numeric: true,
      disablePadding: false,
      label: "Straw Zone",
    },
    {
      id: "WaterZone",
      numeric: true,
      disablePadding: false,
      label: "Water Zone",
    },
    {
      id: "Days",
      numeric: true,
      disablePadding: false,
      label: "Days",
    },
    {
      id: "Status",
      numeric: true,
      disablePadding: false,
      label: "Status",
    },
    {
      id: "Approve",
      numeric: true,
      disablePadding: false,
      label: "Approve",
    },
    {
      id: "Notes",
      numeric: true,
      disablePadding: false,
      label: "Notes",
    },
  ];

  const ButtonsApproved = ({ id, status }) => {
    return (
      <IconButton
        disabled={status.toLowerCase() !== "pending"}
        onClick={() => handleOpenEditStatusodal(id)}
        className="text-white bg-[#3B81F6] hover:text-[#3B81F6] hover:bg-white rounded-2xl text-sm"
      >
        {status.toLowerCase() === "pending"
          ? "Approve"
          : status.toLowerCase() === "rejected"
          ? "Rejected"
          : "Accepted"}
      </IconButton>
    );
  };

  const ButtonsNotes = ({ id, status }) => {
    return (
      <IconButton
        disabled={status.toLowerCase() !== "rejected"}
        onClick={() => handleOpenNotesodal(id)}
        className="text-white bg-[#3B81F6] hover:text-[#3B81F6] hover:bg-white"
      >
        <Visibility />
      </IconButton>
    );
  };
  const row = data?.map((elem) => {
    return {
      id: elem.id,
      ID: elem.id,
      MixingRequest: elem.mixingRequest.mixingNumberRequest,
      FermintationDate: formatDate(elem.fermintationDate),
      StrawZone: elem.starwZone.name,
      WaterZone: elem.waterZone.name,
      Days: elem.days,
      Status: elem.status,
      Approve: <ButtonsApproved id={elem.id} status={elem.status} />,
      Notes: <ButtonsNotes id={elem.id} status={elem.status} />,
    };
  });

  const handleSubmitApproveModal = () => {
    setSnackMessage("Status Updated Successfully");
    setOpenSnackBar(true);
    setIsEditStatusModalOpen(false);
    refetch();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };

  const handleOpenEditStatusodal = (id) => {
    setSelectedId(id);
    setIsEditStatusModalOpen(true);
  };

  const handleOpenNotesodal = (id) => {
    setSelectedId(id);
    setIsNotesModalOpen(true);
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
        selectOptions={statusList}
      />
      <EnhancedTable
        rows={row || []}
        headCells={headCells}
        loading={isLoading}
      />

      {isEditStatusModalOpen && (
        <ApproveFermentationModal
          title="Fermentation Requests Approval"
          withCancel
          cancelFcn={() => setIsEditStatusModalOpen(false)}
          type="Save"
          closeModal={() => setIsEditStatusModalOpen(false)}
          saveFcn={handleSubmitApproveModal}
          data={data.find((elem) => elem.id === selectedId)}
        />
      )}
      {isNotesModalOpen && (
        <MirNotesModal
          title="Notes"
          type="Close"
          closeModal={() => setIsNotesModalOpen(false)}
          saveFcn={() => setIsNotesModalOpen(false)}
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