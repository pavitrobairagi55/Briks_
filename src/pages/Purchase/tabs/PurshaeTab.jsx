import { useContext, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import UseFetchData from "../../../shared/useFetchData";
import { AuthContext } from "../../../shared/authContext";
import { Snackbar, SnackbarContent } from "@mui/material";
import DeleteModal from "../../../components/DeleteModal";
import { formatDate } from "../../../utils";
import axios from "../../../api/axios";
import AddPurchaseModal from "../Modals/AddPurchaseModal";
import EditPurchaseModal from "../Modals/EditPurchaseModal";
export default function PurshaeTab() {
  const [search, setSearch] = useState();
  const [date, setDate] = useState();
  const [selectValue, setSelectValue] = useState();
  const [selectedId, setSelectedId] = useState(null);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getFilteredURL = () => {
    let urlapi = "api/Purchases?";
    if (search?.length) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") + "SearchKey=" + search;
    }
    return urlapi;
  };
  const auth = useContext(AuthContext);
  const [error, setError] = useState();
  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), [search]);
  const horizontal = "center";
  const vertical = "top";

  const rows = data?.items?.map((elem) => {
    return {
      id: elem.id,
      PoNumber: elem.poNumber,
      SupplierName: elem.supplier?.supplierName,
      PurchaseOrderDate: formatDate(elem.purchaseOrderDate),
      DeliveryDate: formatDate(elem.deliveryDate),
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
  const handleOpenViewteodal = (id) => {
    setSelectedId(id);
    setIsViewModalOpen(true);
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
  const handleSubmitAddModal = () => {
    setSnackMessage("Added Successfully");
    setOpenSnackBar(true);
    setIsModalOpen(false);
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
      await axios.delete(`api/Purchases/${selectedId}`, {
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

  const headCells = [
    {
      id: "id",
      numeric: false,
      disablePadding: true,
      label: "ID",
    },
    {
      id: "PoNumber",
      numeric: false,
      disablePadding: true,
      label: "Po Number",
    },
    {
      id: "SupplierName",
      numeric: true,
      disablePadding: false,
      label: "Supplier Name",
    },
    {
      id: "PurchaseOrderDate",
      numeric: true,
      disablePadding: false,
      label: "Purchase Order Date",
    },
    {
      id: "DeliveryDate",
      numeric: true,
      disablePadding: false,
      label: "Delivery Date",
    },
  ];
  return (
    <>
      <HeaderFilter
        searchExist
        search={search}
        seachChange={(val) => setSearch(val.target.value)}
        button="New"
        buttonClick={() => setIsModalOpen(true)}
        searchPlaceHolder={"Po Number"}
      />
      <EnhancedTable
        rows={rows || []}
        headCells={headCells}
        toolbar={["View", "Edit", "Delete"]}
        onEdit={handleOpenEditeodal}
        onView={handleOpenViewteodal}
        onDelete={handleOpenDeleteodal}
        loading={isLoading}
      />
      {isModalOpen && (
        <AddPurchaseModal
          title="Add"
          withCancel
          cancelFcn={() => setIsModalOpen(false)}
          type="ADD"
          closeModal={() => setIsModalOpen(false)}
          saveFcn={handleSubmitAddModal}
          Editable={true}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          cancelFcn={handleCloseDeleteModal}
          saveFcn={() =>
            handleDeleteSnackBar(
              "Purchase Deleted Successfully!",
              deleteRequest,
              handleCloseDeleteModal,
              refetch
            )
          }
          closeModal={handleCloseDeleteModal}
          title={"Delete Purchase"}
          type={"Yes"}
          withCancel={true}
          error={error}
        />
      )}
      {isEditModalOpen && (
        <EditPurchaseModal
          title="Edit"
          withCancel
          cancelFcn={() => setIsEditModalOpen(false)}
          type="Edit"
          closeModal={() => setIsEditModalOpen(false)}
          saveFcn={handleSubmitEditModal}
          editable={true}
          data={data?.items?.find((elem) => elem.id === selectedId)}
        />
      )}
      {isViewModalOpen && (
        <EditPurchaseModal
          title="View"
          withCancel={false}
          cancelFcn={() => setIsViewModalOpen(false)}
          type="Close"
          closeModal={() => setIsViewModalOpen(false)}
          saveFcn={() => setIsViewModalOpen(false)}
          editable={false}
          data={data?.items?.find((elem) => elem.id === selectedId)}
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
