import { useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import IButton from "../../../components/buttons/IconButton";
import { StatusComponent } from "../../../components/statusComponent";
import UseFetchData from "../../../shared/useFetchData";
import { formatDate } from "../../../utils";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import AddApprovalModal from "../modals/AddApprovalModal";

export default function StorageTAB() {
  const [search, setSearch] = useState();
  const [date, setDate] = useState();
  const [selectValue, setSelectValue] = useState();
  const [selectedId, setSelectedId] = useState(null);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const getFilteredURL = () => {
    let urlapi = "api/Storage?";

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
      id: "StorageReq",
      numeric: false,
      disablePadding: true,
      label: "Storage Req",
    },
    {
      id: "CreatedDate",
      numeric: true,
      disablePadding: false,
      label: "Created Date",
    },
    {
      id: "BrickByPallete",
      numeric: true,
      disablePadding: false,
      label: "Brick By Pallete",
    },
    {
      id: "ComprehensiveStrenth",
      numeric: true,
      disablePadding: false,
      label: "Comprehensive Strenth",
    },
    {
      id: "FlexuralStrenth",
      numeric: true,
      disablePadding: false,
      label: "Flexural Strenth",
    },
    {
      id: "StorageArea",
      numeric: true,
      disablePadding: false,
      label: "Storage Area",
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
  ];
  const handleOpenAddModal = (id) => {
    setSelectedId(id);
    setIsAddModalOpen(true);
  };
  const Buttons = ({ id, openModalFCN, status }) => {
    return (
      <IconButton
        disabled={status.toLowerCase() !== "accepted"}
        onClick={() => openModalFCN(id)}
        className={`text-white bg-[#3B81F6] hover:text-[#3B81F6] hover:bg-white rounded-2xl text-sm px-3`}
      >
        Add Approval
      </IconButton>
    );
  };

  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      StorageReq: elem.id,
      MixingNumberRequest: elem.mixingRequest.mixingNumberRequest,
      CreatedDate: formatDate(elem.collectionRequest.collectionDate),
      BrickByPallete: elem.brickByPallete,
      ComprehensiveStrenth: elem.comprehensiveStrenth,
      FlexuralStrenth: elem.flexuralStrenth,
      Status: elem.status,
      StorageArea: elem.storageLocation.name,
      Approve: (
        <Buttons
          id={elem.id}
          openModalFCN={handleOpenAddModal}
          status={elem.status}
        />
      ),
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
        loading={isLoading}
      />
      {isAddModalOpen && (
        <AddApprovalModal
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
