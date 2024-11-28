import { useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import UseFetchData from "../../../shared/useFetchData";
import { formatDate } from "../../../utils";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import AddPlasterAndMortarModal from "../Modals/AddPlasterAndMortarModal";
import AddFermentationModal from "../Modals/AddFermentationModal";

export default function MixingRequestsTAB() {
  const [isAddPlasterModalOpen, setIsAddPlasterModalOpen] = useState(false);
  const [isFermentationModalOpen, setIsFermentationModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
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
      id: "MixID",
      numeric: false,
      disablePadding: true,
      label: "Mix ID",
    },
    {
      id: "MixingRequest",
      numeric: true,
      disablePadding: false,
      label: "Mixing Request",
    },
    {
      id: "Mir",
      numeric: true,
      disablePadding: false,
      label: "Mir",
    },
    {
      id: "FermentationPlan",
      numeric: true,
      disablePadding: false,
      label: "Fermentation Plan",
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
      id: "AddPlasterAndMorter",
      numeric: true,
      disablePadding: false,
      label: "Add Plaster And Morter",
    },
    /* {
      id: "Fermentation",
      numeric: true,
      disablePadding: false,
      label: "Fermentation",
    }, */
  ];

  const ButtonAddPlaster = ({ id, status }) => {
    return (
      <IconButton
        disabled={status.toLowerCase() !== "accepted"}
        onClick={() => handleOpenAddPlasterModal(id)}
        className="text-white bg-[#3B81F6] hover:text-[#3B81F6] hover:bg-white rounded-2xl text-sm"
      >
        Add Plaster And Morter
      </IconButton>
    );
  };

  const ButtonFermontation = ({ id, status }) => {
    return (
      <IconButton
        disabled={status.toLowerCase() !== "accepted"}
        onClick={() => handleOpenAddFermentationModal(id)}
        className="text-white bg-[#3B81F6] hover:text-[#3B81F6] hover:bg-white rounded-2xl text-sm"
      >
        Fermentation
      </IconButton>
    );
  };
  const handleOpenAddPlasterModal = (id) => {
    setSelectedId(id);
    setIsAddPlasterModalOpen(true);
  };
  const handleSubmitAddPlasterModal = () => {
    setSnackMessage("Added Successfully");
    setOpenSnackBar(true);
    setIsAddPlasterModalOpen(false);
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };

  const handleOpenAddFermentationModal = (id) => {
    setSelectedId(id);
    setIsFermentationModalOpen(true);
  };
  const handleSubmitAddFermentationModal = () => {
    setSnackMessage("Added Successfully");
    setOpenSnackBar(true);
    setIsFermentationModalOpen(false);
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
  const row = data?.map((elem) => {
    return {
      id: elem.id,
      MixID: elem.id,
      MixingRequest: elem.mixingNumberRequest,
      Mir: elem.mirRequest.mir,
      FermentationPlan: elem.fermentationZone.name,
      StartDate: formatDate(elem.mixingDate),
      RedClay: elem.redClay,
      Status: elem.status,
      AddPlasterAndMorter: (
        <ButtonAddPlaster id={elem.id} status={elem.status} />
      ),
      Fermentation: <ButtonFermontation id={elem.id} status={elem.status} />,
    };
  });
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
        searchPlaceHolder={"MIXING Number"}
      />
      <EnhancedTable
        rows={row || []}
        headCells={headCells}
        loading={isLoading}
      />

      {isAddPlasterModalOpen && (
        <AddPlasterAndMortarModal
          title="Add Plaster And Mortar"
          withCancel
          cancelFcn={() => setIsAddPlasterModalOpen(false)}
          type="Add"
          closeModal={() => setIsAddPlasterModalOpen(false)}
          saveFcn={handleSubmitAddPlasterModal}
          data={data.find((elem) => elem.id === selectedId)}
        />
      )}
      {isFermentationModalOpen && (
        <AddFermentationModal
          title="Add Fermentation"
          withCancel
          cancelFcn={() => setIsFermentationModalOpen(false)}
          type="Add"
          closeModal={() => setIsFermentationModalOpen(false)}
          saveFcn={handleSubmitAddFermentationModal}
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
