import { useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import UseFetchData from "../../../shared/useFetchData";
import { formatDate } from "../../../utils";
import AddProductionOrderModal from "../Modals/AddProductionOrderModal";

export default function ProductionBricksRequests() {
  const [search, setSearch] = useState();
  const [date, setDate] = useState();
  const [selectValue, setSelectValue] = useState();
  const [selectedId, setSelectedId] = useState(null);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [isAddProductionOrderModalOpen, setIsAddProductionOrderModalOpen] =
    useState(false);

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
  const horizontal = "center";
  const vertical = "top";
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
      id: "ProductionOrder",
      numeric: true,
      disablePadding: false,
      label: "Production Order",
    },
  ];
  const status = [
    { id: "Pending", value: "Pending" },
    { id: "Accepted", value: "Accepted" },
    { id: "Rejected", value: "Rejected" },
  ];

  const handleOpenAddPlasterModal = (id) => {
    setSelectedId(id);
    setIsAddProductionOrderModalOpen(true);
  };
  const handleSubmitAddPlasterModal = () => {
    setSnackMessage("Added Successfully");
    setOpenSnackBar(true);
    setIsAddProductionOrderModalOpen(false);
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };

  const Buttons = ({ id, openModalFCN, status }) => {
    return (
      <IconButton
        disabled={
          status?.toLowerCase() !== "accepted" &&
          status?.toLowerCase() !== "finished"
        }
        onClick={() => openModalFCN(id)}
        className="text-white bg-[#3B81F6] hover:text-[#3B81F6] hover:bg-white rounded-2xl text-sm px-3"
      >
        Add Production Order
      </IconButton>
    );
  };

  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      ID: elem.id,
      MixingRequest: elem.mixingRequest.mixingNumberRequest,
      FermintationDate: formatDate(elem.fermintationDate),
      StrawZone: elem.starwZone.name,
      WaterZone: elem.waterZone.name,
      Days: elem.days,
      ProductionOrder: (
        <Buttons
          id={elem.id}
          openModalFCN={handleOpenAddPlasterModal}
          status={elem.status}
        />
      ),
      Status: elem.status,
    };
  });

  return (
    <>
      <HeaderFilter
        searchExist
        search={search}
        seachChange={(val) => setSearch(val.target.value)}
        date={date}
        dateChange={updateDates}
        dateExist
        selectExists
        selectChange={(val) => setSelectValue(val.target.value)}
        selectOptions={status}
      />
      <EnhancedTable
        rows={rows || []}
        headCells={headCells}
        toolbar={["Print"]}
        loading={isLoading}
      />

      {isAddProductionOrderModalOpen && (
        <AddProductionOrderModal
          title="Add Production Order"
          withCancel
          cancelFcn={() => setIsAddProductionOrderModalOpen(false)}
          type="Add"
          closeModal={() => setIsAddProductionOrderModalOpen(false)}
          saveFcn={handleSubmitAddPlasterModal}
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
