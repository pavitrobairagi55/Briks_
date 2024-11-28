import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";
import UseFetchData from "../../../shared/useFetchData";
import EditStorageModal from "../Modals/EditStorageModal";
import { formatDate } from "../../../utils";
import { Snackbar, SnackbarContent } from "@mui/material";
import { VITE_FILE_URL } from "../../../envirement";
import DeleteModal from "../../../components/DeleteModal";

export default function StorageTab() {
  const auth = useContext(AuthContext);
  const [error, setError] = useState();

  const [search, setSearch] = useState();
  const [date, setDate] = useState();
  const [selectValue, setSelectValue] = useState();
  const [selectedId, setSelectedId] = useState(null);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
      id: "MixingNumberRequest",
      numeric: true,
      disablePadding: false,
      label: "MixingNumberRequest",
    },
    {
      id: "CreatedDate",
      numeric: true,
      disablePadding: false,
      label: "CreatedDate",
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
      label: "Flexural Strenth ",
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
    {
      id: "testReportFile",
      numeric: true,
      disablePadding: false,
      label: "Test Report File",
    },
    {
      id: "locationFile",
      numeric: true,
      disablePadding: false,
      label: "Location File",
    },
  ];
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
      Storage: elem.storageLocation.name,
      testReportFile: (
        <a
          href={VITE_FILE_URL + elem.testReportFile.path}
          className=" text-blue-400 mr-4 hover:text-blue-600"
          target="_blank"
        >
          View File
        </a>
      ),
      locationFile: (
        <a
          href={VITE_FILE_URL + elem.locationFile.path}
          className=" text-blue-400 mr-4 hover:text-blue-600"
          target="_blank"
        >
          View File
        </a>
      ),
    };
  });
  const handleOpenDeleteodal = (id) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };
  const handleOpenEditeodal = (id) => {
    setSelectedId(id);
    setIsEditModalOpen(true);
  };

  const handleSubmitEditModal = () => {
    setSnackMessage("Updated Successfully");
    setOpenSnackBar(true);
    setIsEditModalOpen(false);
    refetch();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
  const handleCloseDeleteModal = () => {
    setError(null);
    setIsDeleteModalOpen(false);
  };
  const deleteRequest = async () => {
    try {
      await axios.delete(`api/Storage/${selectedId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return true;
    } catch (error) {
      setError(error.response?.data);

      return false;
    }
  };
  const handleDeleteSnackBar = async (
    message,
    deleteFCN,
    closeFCN,
    refetchFCN
  ) => {
    const isDeleted = await deleteFCN();

    if (isDeleted) {
      setSnackMessage(message);
      setOpenSnackBar(true);
      closeFCN(false);
      refetchFCN();
      setTimeout(() => {
        setOpenSnackBar(false);
      }, 2000);
    }
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
        toolbar={["Edit", "Delete", "Print"]}
        loading={isLoading}
        onEdit={handleOpenEditeodal}
        onDelete={handleOpenDeleteodal}
      />
      {isDeleteModalOpen && (
        <DeleteModal
          cancelFcn={handleCloseDeleteModal}
          saveFcn={() =>
            handleDeleteSnackBar(
              "Item Deleted Successfully!",
              deleteRequest,
              handleCloseDeleteModal,
              refetch
            )
          }
          closeModal={handleCloseDeleteModal}
          title={"Delete Item"}
          type={"Yes"}
          withCancel={true}
          error={error}
        />
      )}
      {isEditModalOpen && (
        <EditStorageModal
          title="Edit"
          withCancel
          cancelFcn={() => setIsEditModalOpen(false)}
          type="Edit"
          closeModal={() => setIsEditModalOpen(false)}
          saveFcn={handleSubmitEditModal}
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
