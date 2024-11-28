import { useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import UseFetchData from "../../../shared/useFetchData";
import { formatDate } from "../../../utils";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import MirNotesModal from "../modals/MirNotesModal";
import ApproveMixingModal from "../modals/ApproveMixingModal";

export default function MixingTAB() {
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
    let urlapi = "api/MixingRequest?";

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
    { id: "Accepted", value: "Accepted" },
    { id: "Rejected", value: "Rejected" },
    { id: "Pending", value: "Pending" },
  ];
  const updateDates = (newDate1, newDate2) => {
    setDate([newDate1, newDate2]);
  };

  const headCells = [
    {
      id: "MixingID",
      numeric: false,
      disablePadding: true,
      label: "Mixing ID",
    },
    {
      id: "MixingRequest",
      numeric: true,
      disablePadding: false,
      label: "Mixing Request",
    },
    {
      id: "MirRequest",
      numeric: true,
      disablePadding: false,
      label: "Mir Request",
    },
    {
      id: "Qty",
      numeric: true,
      disablePadding: false,
      label: "Qty",
    },
    {
      id: "FermentationPan",
      numeric: true,
      disablePadding: false,
      label: "Fermentation Pan",
    },
    {
      id: "StartDate",
      numeric: true,
      disablePadding: false,
      label: "Start Date",
    },
    {
      id: "RedClay",
      numeric: true,
      disablePadding: false,
      label: "Red Clay",
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
          : "Approved"}
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
      MixingID: elem.id,
      MixingRequest: elem.mixingNumberRequest,
      MirRequest: elem.mirRequest.id,
      SerialNumber: elem.mirRequest.serialNumber,
      Qty: elem.mirRequest.quantity,
      FermentationPan: elem.fermentationZone.name,
      StartDate: formatDate(elem.mixingDate),
      RedClay: elem.redClay,
      Status: elem.status === "Accepted" ? "Approved" : elem.status,
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
        <ApproveMixingModal
          title="Mixing Request Approval"
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
