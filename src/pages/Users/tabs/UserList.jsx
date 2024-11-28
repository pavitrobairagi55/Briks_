import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import DeleteModal from "../../../components/DeleteModal";
import ResetPasswordModal from "../Modals/ResetPasswordModal";
import AddUserModal from "../Modals/AddUserModal";
import ViewUserModal from "../Modals/ViewUserModal";
import BlockIcon from "@mui/icons-material/Block";
import { Edit } from "@mui/icons-material/";
import UseFetchData from "../../../shared/useFetchData";
export default function UserList() {
  const [search, setSearch] = useState("");
  const auth = useContext(AuthContext);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);

  const [documentPerPage, setDocumentPerPage] = useState(5);

  const [error, setError] = useState();

  const getFilteredURL = () => {
    let urlapi = "api/Users?page=0&pageSize=1000";

    if (search?.length) {
      urlapi += "&email=" + search;
    }

    return urlapi;
  };

  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), [search]);

  const handleAddSnackBar = (message, handleSaveFCN) => {
    setSnackMessage(message);
    setOpenSnackBar(true);
    handleSaveFCN();
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
    setDeleteModalOpen(false);
  };

  const handleOpenEditModal = (id) => {
    setSelectedId(id);
    setEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };
  const handleOpenViewModal = (id) => {
    setSelectedId(id);
    setViewModalOpen(true);
  };
  const handleCloseViewModal = () => {
    setViewModalOpen(false);
  };

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };
  const handleCloseAddModal = () => {
    setAddModalOpen(false);
    refetch();
  };

  const Buttons = ({ id, openModalFCN }) => {
    return (
      <IconButton
        onClick={() => handleOpenEditModal(() => openModalFCN(id))}
        color="primary"
        aria-label="add to shopping cart"
        className="text-white bg-[#21C55D] hover:text-[#21C55D] hover:bg-white"
      >
        <Edit />
      </IconButton>
    );
  };
  const BlockButton = ({ id, blocked }) => {
    return (
      <IconButton
        onClick={() => blockUnblockFCN(blocked, id)}
        color="primary"
        aria-label="add to shopping cart"
        className={
          blocked
            ? "text-white bg-[#21C55D] hover:text-[#21C55D] hover:bg-white"
            : "text-white bg-red-600 hover:text-red-600 hover:bg-white"
        }
      >
        <BlockIcon />
      </IconButton>
    );
  };

  const blockUnblockFCN = async (blocked, id) => {
    const url = blocked ? `api/users/${id}/unblock` : `api/users/${id}/block`;
    try {
      await axios.put(
        url,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      refetch();
      return true;
    } catch (error) {
      setError(JSON.parse(error.request.response).title);

      return false;
    }
  };

  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      Location: elem.locationName,
      FirstName: elem.firstname,
      LastName: elem.lastname,
      Email: elem.email,
      Status: elem.blocked ? "Blocked" : "Active",
      /* ResetPassword: (
        <Buttons id={elem.id} openModalFCN={handleOpenEditModal} />
      ), */
      Role: elem.role,
      blockUnblock: <BlockButton id={elem.id} blocked={elem.blocked} />,
    };
  });

  const headCells = [
    {
      id: "Location",
      numeric: false,
      disablePadding: true,
      label: "Location",
    },
    {
      id: "FirstName",
      numeric: true,
      disablePadding: false,
      label: "First Name",
    },
    {
      id: "LastName",
      numeric: true,
      disablePadding: false,
      label: "Last Name",
    },
    {
      id: "Email",
      numeric: true,
      disablePadding: false,
      label: "Email",
    },
    {
      id: "Status",
      numeric: true,
      disablePadding: false,
      label: "Status",
    },
    {
      id: "Role",
      numeric: true,
      disablePadding: false,
      label: "Role",
    },
    /* {
      id: "ResetPassword",
      numeric: true,
      disablePadding: false,
      label: "Reset Password",
    }, */
    {
      id: "blockUnblock",
      numeric: true,
      disablePadding: false,
      label: "Block/Unblock",
    },
  ];
  return (
    <>
      <HeaderFilter
        button={"Add"}
        buttonClick={handleOpenAddModal}
        searchExist
        search={search}
        seachChange={(val) => setSearch(val.target.value)}
        searchPlaceHolder={"Email"}
      />
      <EnhancedTable
        rows={rows || []}
        headCells={headCells}
        toolbar={["View"]}
        onView={handleOpenViewModal}
        loading={isLoading}
        /* pageNumber={pageNumber}
        documentPerPage={documentPerPage}
        setPageNumber={setPageNumber}
        setDocumentPerPage={setDocumentPerPage} */
      />
      {isAddModalOpen && (
        <AddUserModal
          cancelFcn={handleCloseAddModal}
          saveFcn={() => handleAddSnackBar("User Added", handleCloseAddModal)}
          closeModal={handleCloseAddModal}
          title={"Add User"}
          type={"Save"}
          withCancel={true}
        />
      )}
      {isEditModalOpen && (
        <ResetPasswordModal
          cancelFcn={handleCloseEditModal}
          saveFcn={handleCloseEditModal}
          closeModal={handleCloseEditModal}
          title={"Reset Password"}
          type={"Update"}
          withCancel={true}
        />
      )}
      {isViewModalOpen && (
        <ViewUserModal
          cancelFcn={handleCloseViewModal}
          saveFcn={handleCloseViewModal}
          closeModal={handleCloseViewModal}
          title={"View User Info"}
          type={"Close"}
          editable={true}
          withCancel={false}
          data={data.find((elem) => elem.id === selectedId)}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          cancelFcn={handleCloseDeleteModal}
          saveFcn={handleCloseDeleteModal}
          closeModal={handleCloseDeleteModal}
          title={"Delete User"}
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
