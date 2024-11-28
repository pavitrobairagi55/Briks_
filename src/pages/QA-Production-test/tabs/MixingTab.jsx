import { useContext, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import UseFetchData from "../../../shared/useFetchData";
import { formatDate } from "../../../utils";
import AddMixingModal from "../modals/AddMixingModal";
import { Snackbar, SnackbarContent } from "@mui/material";
import EditMixingModal from "../modals/EditMixingModal";
import DeleteModal from "../../../components/DeleteModal";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";

export default function MixingTab() {
  const auth = useContext(AuthContext);

  const [error, setError] = useState();
  const [selectedId, setSelectedId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
      id: "MixingId",
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
      id: "MirNumber",
      numeric: true,
      disablePadding: false,
      label: "Mir Number",
    },
    {
      id: "SerialNumber",
      numeric: true,
      disablePadding: false,
      label: "Serial Number",
    },
    {
      id: "FermentationPan",
      numeric: true,
      disablePadding: false,
      label: "Fermentation Pan",
    },
    {
      id: "Qty",
      numeric: true,
      disablePadding: false,
      label: "Qty",
    },
    {
      id: "MixingDate",
      numeric: true,
      disablePadding: false,
      label: "Mixing Date",
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
  ];
  const row = data?.map((elem) => {
    return {
      id: elem.id,
      MixingId: elem.id,
      MixingRequest: elem.mixingNumberRequest,
      MirNumber: elem.mirRequest.id,
      SerialNumber: elem.mirRequest.serialNumber,
      Qty: elem.mirRequest.quantity,
      FermentationPan: elem.fermentationZone.name,
      MixingDate: formatDate(elem.mixingDate),
      RedClay: elem.redClay,
      Status: elem.status,
    };
  });

  const handleSubmitEditModal = () => {
    setSnackMessage("Mixing Request Updated Successfully");
    setOpenSnackBar(true);
    setIsEditModalOpen(false);
    refetch();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };

  const handleOpenDeleteodal = (id) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };
  const handleOpenEditeodal = (id) => {
    setSelectedId(id);
    setIsEditModalOpen(true);
  };
  const handleCloseDeleteModal = () => {
    setError(null);
    setIsDeleteModalOpen(false);
  };
  const deleteMixing = async () => {
    try {
      await axios.delete(`api/MixingRequest/${selectedId}`, {
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
        searchPlaceHolder={"MIXING Number"}
      />
      <EnhancedTable
        rows={row || []}
        headCells={headCells}
        toolbar={["Edit", "Delete", "Print"]}
        onEdit={handleOpenEditeodal}
        onDelete={handleOpenDeleteodal}
        loading={isLoading}
      />

      {isEditModalOpen && (
        <EditMixingModal
          title="Edit Mixing Request"
          withCancel
          cancelFcn={() => setIsEditModalOpen(false)}
          type="Edit"
          closeModal={() => setIsEditModalOpen(false)}
          saveFcn={handleSubmitEditModal}
          data={data.find((elem) => elem.id === selectedId)}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          cancelFcn={handleCloseDeleteModal}
          saveFcn={() =>
            handleDeleteSnackBar(
              "Mixing Request Deleted Successfully!",
              deleteMixing,
              handleCloseDeleteModal,
              refetch
            )
          }
          closeModal={handleCloseDeleteModal}
          title={"Delete Mixing Request "}
          type={"Yes"}
          withCancel={true}
          error={error}
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
