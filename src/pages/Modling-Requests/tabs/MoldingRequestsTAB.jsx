import { useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import EditCollectionModal from "../Modals/EditCollectionModal";
import UseFetchData from "../../../shared/useFetchData";
import { formatDate } from "../../../utils";
import AddCollectionModal from "../Modals/AddCollectionModal";

export default function MoldingRequestsTAB() {
  const [search, setSearch] = useState();
  const [date, setDate] = useState();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [selectValue, setSelectValue] = useState();
  const [isEditCollectionModalOpen, setEditCollectionModalOpen] =
    useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const getFilteredURL = () => {
    let urlapi = "api/Molding/requests?";

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
  const handleOpenAddMeodal = (id) => {
    setSelectedId(id);
    setAddModalOpen(true);
  };
  const handleSubmitAddCollectionModal = () => {
    setSnackMessage("Collection Added Successfully");
    setOpenSnackBar(true);
    setAddModalOpen(false);
    refetch();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };

  const updateDates = (newDate1, newDate2) => {
    setDate([newDate1, newDate2]);
  };
  const headCells = [
    {
      id: "MoldingRequest",
      numeric: false,
      disablePadding: true,
      label: "Molding Request",
    },
    {
      id: "MixingRequest",
      numeric: true,
      disablePadding: false,
      label: "Mixing Request",
    },
    {
      id: "BricksProductionOrder",
      numeric: true,
      disablePadding: false,
      label: "Bricks Production Order",
    },
    {
      id: "MoldingDate",
      numeric: true,
      disablePadding: false,
      label: "Molding Date",
    },
    {
      id: "MoldingArea",
      numeric: true,
      disablePadding: false,
      label: "Molding Area",
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
      id: "Collection",
      numeric: true,
      disablePadding: false,
      label: "Collection",
    },
  ];

  const Buttons = ({ id, openModalFCN, status }) => {
    return (
      <IconButton
        disabled={status.toLowerCase() !== "accepted"}
        onClick={() => openModalFCN(id)}
        className="text-white bg-[#3B81F6] hover:text-[#3B81F6] hover:bg-white rounded-2xl text-sm"
      >
        Add Collection
      </IconButton>
    );
  };

  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      MoldingRequest: elem.id,
      MixingRequest: elem.mixingRequest.mixingNumberRequest,
      BricksProductionOrder: elem.bricksProductionOrder.prodcutionOrderDate,
      MoldingDate: formatDate(elem.moldingDate),
      MoldingArea: elem.moldingArea.name,
      Days: elem.days,
      Status: elem.status,
      Collection: (
        <Buttons
          id={elem.id}
          status={elem.status}
          openModalFCN={handleOpenAddMeodal}
        />
      ),
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
      />
      <EnhancedTable
        rows={rows || rows}
        headCells={headCells}
        toolbar={["Print"]}
      />
      {isAddModalOpen && (
        <AddCollectionModal
          cancelFcn={() => setAddModalOpen(false)}
          saveFcn={handleSubmitAddCollectionModal}
          closeModal={() => setAddModalOpen(false)}
          title={"Add Collection"}
          type={"Save"}
          Editable={true}
          withCancel={true}
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
