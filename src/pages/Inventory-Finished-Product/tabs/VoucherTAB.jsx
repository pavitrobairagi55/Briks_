import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import AddVoucher from "../modals/AddVoucher";
import { AuthContext } from "../../../shared/authContext";
import { Snackbar, SnackbarContent } from "@mui/material";
import axios from "../../../api/axios";
import { formatDate } from "../../../utils";
import EditVoucher from "../modals/EditVoucher";
import DeleteModal from "../../../components/DeleteModal";
import UseFetchData from "../../../shared/useFetchData";

export default function VoucherTAB() {
  const [search, setSearch] = useState();
  const [error, setError] = useState();

  const [selectValue, setSelectValue] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const auth = useContext(AuthContext);
  const getFilteredURL = () => {
    let urlapi = "api/Voucher/finished?";

    if (search?.length) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") + "search=" + search;
    }
    if (selectValue?.length) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") + "type=" + selectValue;
    }
    return urlapi;
  };

  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), [
    selectValue,
    search,
  ]);

  const headCells = [
    {
      id: "ID",
      numeric: false,
      disablePadding: true,
      label: "ID",
    },
    {
      id: "Date",
      numeric: true,
      disablePadding: false,
      label: "Date",
    },
    {
      id: "Type",
      numeric: true,
      disablePadding: false,
      label: "Type",
    },
  ];
  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      ID: elem.id,
      Date: formatDate(elem.dateCreated),
      Type: elem.type,
    };
  });
  const horizontal = "center";
  const vertical = "top";
  const voucherTypes = [
    { id: "In", value: "In" },
    { id: "Out", value: "Out" },
    { id: "OpenBalance", value: "Open Balance" },
  ];

  const deleteVoucher = async () => {
    try {
      await axios.delete(`api/Voucher/finished/${selectedId}`, {
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

  const handleSnackBar = (message, handleSaveFCN, refetchFCN) => {
    setSnackMessage(message);
    setOpenSnackBar(true);
    handleSaveFCN(false);
    refetchFCN();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };
  const toolbarItems = auth.role.includes("SUPER ADMIN")
    ? ["Edit", "Delete"]
    : [];
  const handleOpenEditModal = (id) => {
    setSelectedId(id);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };
  const handleOpenDeleteModal = (id) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = () => {
    setError(null);

    setIsDeleteModalOpen(false);
  };
  const handleDeleteSnackBar = async (message) => {
    const isDeleted = await deleteVoucher();

    if (isDeleted) {
      setSnackMessage(message);
      setOpenSnackBar(true);
      handleCloseDeleteModal();
      refetch();
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
        selectChange={(val) => setSelectValue(val.target.value)}
        selectOptions={voucherTypes}
        button={"New"}
        buttonClick={() => setIsModalOpen(true)}
        searchPlaceHolder={"Voucher Number"}
      />
      <EnhancedTable
        rows={rows || []}
        headCells={headCells}
        toolbar={toolbarItems}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
        loading={isLoading}
      />
      {isModalOpen && (
        <AddVoucher
          saveFcn={() =>
            handleSnackBar(
              "Voucher Added Successfully!",
              setIsModalOpen,
              refetch
            )
          }
          withCancel={true}
          cancelFcn={() => setIsModalOpen(false)}
          closeModal={() => setIsModalOpen(false)}
          type="Save"
          title="Add A Voucher"
          voucherTypes={voucherTypes}
        />
      )}
      {isEditModalOpen && (
        <EditVoucher
          saveFcn={() =>
            handleSnackBar(
              "Voucher Updated Successfully!",
              handleCloseEditModal,
              refetch
            )
          }
          withCancel={true}
          cancelFcn={handleCloseEditModal}
          closeModal={handleCloseEditModal}
          type="Save"
          title="Edit Voucher"
          voucherTypes={voucherTypes}
          data={data.find((elem) => elem.id === selectedId)}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          cancelFcn={handleCloseDeleteModal}
          saveFcn={() => handleDeleteSnackBar("Voucher Deleted Successfully")}
          closeModal={handleCloseDeleteModal}
          title={"Delete Driver"}
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
