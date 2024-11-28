import { useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import UseFetchData from "../../../shared/useFetchData";
import { formatDate } from "../../../utils";
import AddMoldingRequestModal from "../Modals/AddMoldingRequestModal";

export default function ProductionBricksTAB() {
  const [search, setSearch] = useState();
  const [date, setDate] = useState();
  const [selectValue, setSelectValue] = useState();
  const [selectedId, setSelectedId] = useState(null);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const getFilteredURL = () => {
    let urlapi = "api/BricksProductionOrder?";

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
  const statusList = [
    { id: "Pending", value: "Pending" },
    { id: "Accepted", value: "Accepted" },
    { id: "Rejected", value: "Rejected" },
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
      id: "BricksType",
      numeric: false,
      disablePadding: true,
      label: "Bricks Type",
    },
    {
      id: "BricksQTY",
      numeric: true,
      disablePadding: false,
      label: "Bricks QTY",
    },
    {
      id: "MoldingArea",
      numeric: true,
      disablePadding: false,
      label: "Molding Area",
    },
    {
      id: "MudStock",
      numeric: true,
      disablePadding: false,
      label: "Mud Stock",
    },
    {
      id: "ProductionDate",
      numeric: true,
      disablePadding: false,
      label: "Production Date",
    },
    {
      id: "Molding",
      numeric: true,
      disablePadding: false,
      label: "Molding",
    },
  ];
  const handleOpenAddModal = (id) => {
    setSelectedId(id);
    setIsAddModalOpen(true);
  };
  const Buttons = ({ id, openModalFCN }) => {
    return (
      <IconButton
        onClick={() => openModalFCN(id)}
        className={`text-white bg-[#3B81F6] hover:text-[#3B81F6] hover:bg-white rounded-2xl text-sm px-3`}
      >
        Add Molding Request
      </IconButton>
    );
  };
  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      ID: elem.id,
      BricksType: elem.bricksType.name,
      FermintationRequest: elem.fermentationRequest.id,
      BricksQty: elem.bricksQuantity,
      MoldingArea: elem.moldingArea.name,
      MudStock: elem.mudStockPan,
      ProductionDate: formatDate(elem.prodcutionOrderDate),
      BricksQTY: elem.bricksQuantity,
      Molding: <Buttons id={elem.id} openModalFCN={handleOpenAddModal} />,
    };
  });

  const handleSubmitAddModal = () => {
    setSnackMessage("Added Successfully");
    setOpenSnackBar(true);
    setIsAddModalOpen(false);
    refetch();
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
        selectOptions={statusList}
      />
      <EnhancedTable
        rows={rows || []}
        headCells={headCells}
        toolbar={["Print"]}
      />
      {isAddModalOpen && (
        <AddMoldingRequestModal
          title="Add"
          withCancel
          cancelFcn={() => setIsAddModalOpen(false)}
          type="Add"
          closeModal={() => setIsAddModalOpen(false)}
          saveFcn={handleSubmitAddModal}
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
