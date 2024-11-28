import { useContext, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import Modal from "../../../components/Modal";
import AddMirModal from "../modals/AddMirModal";
import DeleteModal from "../../../components/DeleteModal";
import UseFetchData from "../../../shared/useFetchData";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";
import { formatDate } from "../../../utils";
import EditMirModal from "../modals/EditMirModal";
import AddMixingModal from "../modals/AddMixingModal";
import { VITE_FILE_URL } from "../../../envirement";

export default function MirTab() {
  const auth = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddMixingModalOpen, setIsAddMixingModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState();
  const [selectedId, setSelectedId] = useState(null);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [search, setSearch] = useState();
  const [date, setDate] = useState();
  const [selectValue, setSelectValue] = useState("");
  const horizontal = "center";
  const vertical = "top";
  const getFilteredURL = () => {
    let urlapi = "api/MirRequests?";

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
  const headCells = [
    {
      id: "MirID",
      numeric: false,
      disablePadding: true,
      label: "Mir ID",
    },
    {
      id: "Mir",
      numeric: true,
      disablePadding: false,
      label: "Mir",
    },
    {
      id: "SoilQty",
      numeric: true,
      disablePadding: false,
      label: "Soil Qty",
    },
    {
      id: "SerialNo",
      numeric: true,
      disablePadding: false,
      label: "Serial No",
    },
    {
      id: "Date",
      numeric: true,
      disablePadding: false,
      label: "Date",
    },
    {
      id: "ClayContent",
      numeric: true,
      disablePadding: false,
      label: "Clay Content",
    },
    {
      id: "JubailahZone",
      numeric: true,
      disablePadding: false,
      label: "Jubailah Zone",
    },
    {
      id: "ViewFile",
      numeric: true,
      disablePadding: false,
      label: "View File",
    },
    {
      id: "Status",
      numeric: true,
      disablePadding: false,
      label: "Status",
    },
    {
      id: "Mixing",
      numeric: true,
      disablePadding: false,
      label: "Mixing",
    },
  ];
  const handleOpenAddMixingModal = (id) => {
    setSelectedId(id);
    setIsAddMixingModalOpen(true);
  };
  const ButtonMixing = ({ id, status }) => {
    return (
      <IconButton
        disabled={status.toLowerCase() !== "accepted"}
        onClick={() => handleOpenAddMixingModal(id)}
        className="text-white bg-[#3B81F6] hover:text-[#3B81F6] hover:bg-white rounded-2xl text-sm"
      >
        Add Mixing
      </IconButton>
    );
  };
  const row = data?.map((elem) => {
    const file = VITE_FILE_URL + elem.uploadFile.path;
    return {
      id: elem.id,
      MirID: elem.id,
      Mir: elem.mir,
      SoilQty: elem.quantity,
      SerialNo: elem.serialNumber,
      Date: formatDate(elem.createdDate),
      ClayContent: elem.clayContent,
      JubailahZone: elem.jubailahZone.name,
      ViewFile: (
        <a
          href={file}
          className=" text-blue-400 mr-4 hover:text-blue-600"
          target="_blank"
        >
          View File
        </a>
      ),
      Status: elem.status,
      Mixing: <ButtonMixing id={elem.id} status={elem.status} />,
    };
  });

  const statusList = [
    { id: "Accepted", value: "Accepted" },
    { id: "Rejected", value: "Rejected" },
    { id: "Pending", value: "Pending" },
  ];
  const updateDates = (newDate1, newDate2) => {
    setDate([newDate1, newDate2]);
  };
  const handleSubmitAddModal = () => {
    setSnackMessage("Mir Added Successfully");
    setOpenSnackBar(true);
    setIsModalOpen(false);
    refetch();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
  const handleSubmitEditModal = () => {
    setSnackMessage("Mir Updated Successfully");
    setOpenSnackBar(true);
    setIsEditModalOpen(false);
    refetch();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
  const deleteMir = async () => {
    try {
      await axios.delete(`api/MirRequests/${selectedId}`, {
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
  const handleCloseDeleteModal = () => {
    setError(null);
    setIsDeleteModalOpen(false);
  };
  const handleOpenDeleteodal = (id) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };
  const handleOpenEditeodal = (id) => {
    setSelectedId(id);
    setIsEditModalOpen(true);
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

  const handleSubmitAddMixingModal = () => {
    setSnackMessage("Mixing Request Added Successfully");
    setOpenSnackBar(true);
    setIsAddMixingModalOpen(false);

    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
  return (
    <>
      <HeaderFilter
        button="New"
        buttonClick={() => setIsModalOpen(true)}
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
        searchPlaceHolder={"MIR Number"}
      />
      <EnhancedTable
        rows={row || []}
        headCells={headCells}
        toolbar={["Edit", "Delete", "Print"]}
        onEdit={handleOpenEditeodal}
        onDelete={handleOpenDeleteodal}
        loading={isLoading}
      />
      {isModalOpen && (
        <AddMirModal
          title="Add Mir"
          withCancel
          cancelFcn={() => setIsModalOpen(false)}
          type="Add"
          closeModal={() => setIsModalOpen(false)}
          saveFcn={handleSubmitAddModal}
        />
      )}
      {isAddMixingModalOpen && (
        <AddMixingModal
          title="Add Mixing Request"
          withCancel
          cancelFcn={() => setIsAddMixingModalOpen(false)}
          type="Add"
          closeModal={() => setIsAddMixingModalOpen(false)}
          saveFcn={handleSubmitAddMixingModal}
          data={data.find((elem) => elem.id === selectedId)}
        />
      )}
      {isEditModalOpen && (
        <EditMirModal
          title="Edit Mir"
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
          cancelFcn={() => setIsDeleteModalOpen(false)}
          saveFcn={() =>
            handleDeleteSnackBar(
              "MIR Deleted Successfully!",
              deleteMir,
              handleCloseDeleteModal,
              refetch
            )
          }
          closeModal={() => setIsDeleteModalOpen(false)}
          title={"Delete Mir Request"}
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
