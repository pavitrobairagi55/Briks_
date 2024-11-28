import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
import { formatDate, handleExcel, handlePrint } from "../../../utils";
import EditModal from "../Modals/EditModal";
import AddModal from "../Modals/AddModal";
import DeleteModal from "../../../components/DeleteModal";
import { Snackbar, SnackbarContent } from "@mui/material";
import useFetch from "../../../shared/useFetch";
import UseFetchData from "../../../shared/useFetchData";

export default function CustomerOrderTab() {
  const auth = useContext(AuthContext);
  const [search, setSearch] = useState();
  const [date, setDate] = useState();

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState();
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const getFilteredURL = () => {
    let urlapi = "/api/CustomerOrders?";

    if (search?.length) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") + "search=" + search;
    }
    if (date?.length === 2 && date[0] && date[1]) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") +
        "From=" +
        date[0] +
        "&To=" +
        date[1];
    }
    return urlapi;
  };
  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), [
    date,
    search,
  ]);

  const handleAddSnackBar = () => {
    setSnackMessage("Order Added");
    setOpenSnackBar(true);

    handleSaveFCN();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
  const handleEditSnackBar = () => {
    setSnackMessage("Order Updated");
    setOpenSnackBar(true);

    refetch();
    setEditModalOpen(false);
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
  const horizontal = "center";
  const vertical = "top";
  const handleOpenDeleteModal = (id) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = () => {
    setError(null);
    setDeleteModalOpen(false);
  };

  const handleOpenEditModal = (id) => {
    setSelectedId(id);
    setEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };
  const handleCloseAddModal = () => {
    setAddModalOpen(false);
  };
  const handleSaveFCN = () => {
    setAddModalOpen(false);
    refetch();
  };
  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      CONumber: elem.id,
      Product: elem.product?.name,
      CustomerName: elem.user?.firstName + " " + elem.user?.lastName,
      ApprovedQuantity:
        elem.approvedQuantity === 0
          ? "----------"
          : elem.approvedQuantity.toFixed(2),
      EpectedDeliveryDate: formatDate(elem.expectedDeliveryDate),
      CreatedDate: formatDate(elem.createdDate),
      Quantity: elem.quantity.toFixed(2),
      OrderStatus: elem.status.name,
    };
  });
  const handleOpenViewModal = (id) => {
    setSelectedId(id);
    setViewModalOpen(true);
  };
  const handleCloseViewModal = () => {
    setViewModalOpen(false);
  };

  const updateDates = (newDate1, newDate2) => {
    setDate([newDate1, newDate2]);
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
  const deleteCustomerOrder = async () => {
    try {
      await axios.delete(`api/CustomerOrders/${selectedId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return true;
    } catch (error) {
      setError(JSON.parse(error.request.response).title);

      return false;
    }
  };
  const headCells = [
    {
      id: "CONumber",
      numeric: false,
      disablePadding: true,
      label: "CO Number",
    },
    {
      id: "Product",
      numeric: true,
      disablePadding: false,
      label: "Product",
    },
    {
      id: "EpectedDeliveryDate",
      numeric: true,
      disablePadding: false,
      label: "Expected Delivery Date",
    },
    {
      id: "CustomerName",
      numeric: true,
      disablePadding: false,
      label: "Customer Name",
    },
    {
      id: "CreatedDate",
      numeric: true,
      disablePadding: false,
      label: "Created Date",
    },

    {
      id: "ApprovedQuantity",
      numeric: true,
      disablePadding: false,
      label: "Approved Quantity",
    },

    {
      id: "Quantity",
      numeric: true,
      disablePadding: false,
      label: "Requested Quantity",
    },
    {
      id: "OrderStatus",
      numeric: false,
      disablePadding: false,
      label: "Order Status",
    },
  ];
  return (
    <>
      <HeaderFilter
        searchExist
        search={search}
        seachChange={(val) => setSearch(val.target.value)}
        date={date}
        dateChange={updateDates}
        dateExist
        button={"Add Order"}
        buttonClick={handleOpenAddModal}
        searchPlaceHolder={"Order Number"}
        onPrint={() =>
          handlePrint(
            "api/CustomerOrders/report",
            `Customer-order-report-${formatDate(new Date())}.pdf`,
            auth
          )
        }
        export={true}
        print={true}
        onExport={() =>
          handleExcel(
            "api/CustomerOrders/report-excel",
            `Customer-order-report-${formatDate(new Date())}.xlsx`,
            auth
          )
        }
      />
      <EnhancedTable
        headCells={headCells}
        rows={rows || []}
        toolbar={["View", "Edit", "Delete"]}
        onEdit={handleOpenEditModal}
        onView={handleOpenViewModal}
        onDelete={handleOpenDeleteModal}
        loading={isLoading}
      />
      {isEditModalOpen && (
        <EditModal
          cancelFcn={handleCloseEditModal}
          saveFcn={handleEditSnackBar}
          closeModal={handleCloseEditModal}
          title={"Edit Customer Order"}
          type={"Edit"}
          Editable={true}
          withCancel={true}
          data={data?.find((elem) => elem.id === selectedId) || null}
        />
      )}
      {isViewModalOpen && (
        <EditModal
          cancelFcn={handleCloseViewModal}
          saveFcn={handleCloseViewModal}
          closeModal={handleCloseViewModal}
          title={"View"}
          type={"Close"}
          Editable={false}
          withCancel={false}
          data={data?.find((elem) => elem.id === selectedId || null)}
        />
      )}
      {isAddModalOpen && (
        <AddModal
          cancelFcn={handleCloseAddModal}
          saveFcn={handleAddSnackBar}
          closeModal={handleCloseAddModal}
          title={"Add Customer Order"}
          type={"Save"}
          withCancel={true}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          cancelFcn={handleCloseDeleteModal}
          saveFcn={() =>
            handleDeleteSnackBar(
              "Order Deleted Successfully!",
              deleteCustomerOrder,
              handleCloseDeleteModal,
              refetch
            )
          }
          closeModal={handleCloseDeleteModal}
          title={"Delete Customer Order"}
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
