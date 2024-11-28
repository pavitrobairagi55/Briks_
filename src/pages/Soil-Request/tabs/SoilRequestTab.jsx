import { useContext, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import AddSoilRequest from "../modals/AddSoilRequest";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import { Edit } from "@mui/icons-material";
import EditSoilRequest from "../modals/EditSoilRequest";
import DeleteModal from "../../../components/DeleteModal";
import UseFetchData from "../../../shared/useFetchData";
import { formatDate } from "../../../utils";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
import ChangeStatus from "../modals/ChangeStatus";

export default function SoilRequestTab() {
  const auth = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState();
  const [selectedId, setSelectedId] = useState(null);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const horizontal = "center";
  const vertical = "top";
  const getFilteredURL = () => {
    let urlapi = "api/ProductionOrders?";
    return urlapi;
  };
  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), []);
  const headCells = [
    {
      id: "ID",
      numeric: false,
      disablePadding: true,
      label: "ID",
    },
    {
      id: "ProductName",
      numeric: false,
      disablePadding: false,
      label: "Product Name",
    },
    {
      id: "Date",
      numeric: false,
      disablePadding: false,
      label: "Date",
    },
    {
      id: "Quantity",
      numeric: true,
      disablePadding: false,
      label: "Quantity",
    },

    {
      id: "Status",
      numeric: false,
      disablePadding: false,
      label: "Status",
    },
    /*  {
      id: "ChangeStatus",
      numeric: false,
      disablePadding: false,
      label: "Change Status",
    }, */
  ];
  const handleSubmitAddModal = () => {
    setSnackMessage("Request Added Successfully");
    setOpenSnackBar(true);
    setIsModalOpen(false);
    refetch();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
  const handleSubmitEditodal = () => {
    setSnackMessage("Request Updated Successfully");
    setOpenSnackBar(true);
    setIsEditModalOpen(false);
    refetch();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
  const handleSubmitEditStatusModal = () => {
    setSnackMessage("Status Updated Successfully");
    setOpenSnackBar(true);
    setIsEditStatusModalOpen(false);
    refetch();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
  const handleOpenEditModal = (id) => {
    setSelectedId(id);
    setIsEditModalOpen(true);
  };
  const handleOpenDeleteodal = (id) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };
  const handleOpenEditStatusModal = (id) => {
    setSelectedId(id);
    setIsEditStatusModalOpen(true);
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
  const deleteSoilRequest = async () => {
    try {
      await axios.delete(`api/ProductionOrders/${selectedId}`, {
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
  const Buttons = ({ id, openModalFCN, status }) => {
    return (
      <IconButton
        disabled={status !== "requested"}
        onClick={() => openModalFCN(id)}
        className="text-white bg-[#3B81F6] hover:text-[#3B81F6] hover:bg-white"
      >
        <Edit />
      </IconButton>
    );
  };

  const handleCloseDeleteModal = () => {
    setError(null);
    setIsDeleteModalOpen(false);
  };
  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      ID: elem.id,
      ProductName: elem.product?.name,
      Date: formatDate(elem.productionDate),
      Quantity: elem.quantity.toFixed(2),
      Status: elem.status?.name,
      ChangeStatus: (
        <Buttons
          id={elem.id}
          openModalFCN={handleOpenEditStatusModal}
          status={elem.status?.name.toLowerCase()}
        />
      ),
    };
  });

  return (
    <>
      <HeaderFilter buttonClick={() => setIsModalOpen(true)} button={"New"} />
      <EnhancedTable
        rows={rows || []}
        headCells={headCells}
        toolbar={["Edit", "Delete"]}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteodal}
        loading={isLoading}
      />
      {isModalOpen && (
        <AddSoilRequest
          type={"Add"}
          title={"Add Soil Request"}
          withCancel
          cancelFcn={() => setIsModalOpen(false)}
          closeModal={() => setIsModalOpen(false)}
          saveFcn={handleSubmitAddModal}
        />
      )}
      {isEditModalOpen && (
        <EditSoilRequest
          type={"Edit"}
          title={"Edit Soil Request"}
          withCancel
          cancelFcn={() => setIsEditModalOpen(false)}
          closeModal={() => setIsEditModalOpen(false)}
          saveFcn={handleSubmitEditodal}
          data={data.find((elem) => elem.id === selectedId)}
        />
      )}
      {isEditStatusModalOpen && (
        <ChangeStatus
          type={"Edit"}
          title={"Change Soil Request Status"}
          withCancel
          cancelFcn={() => setIsEditStatusModalOpen(false)}
          closeModal={() => setIsEditStatusModalOpen(false)}
          saveFcn={handleSubmitEditStatusModal}
          data={data.find((elem) => elem.id === selectedId)}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          cancelFcn={() => setIsDeleteModalOpen(false)}
          saveFcn={() =>
            handleDeleteSnackBar(
              "Request Deleted Successfully!",
              deleteSoilRequest,
              handleCloseDeleteModal,
              refetch
            )
          }
          closeModal={() => setIsDeleteModalOpen(false)}
          title={"Delete Soil Request"}
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
