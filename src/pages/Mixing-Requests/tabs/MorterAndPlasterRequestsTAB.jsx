import { useContext, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import UseFetchData from "../../../shared/useFetchData";
import { formatDate } from "../../../utils";
import QrCodeModal from "../Modals/QrCodeModal";
import DeleteModal from "../../../components/DeleteModal";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";
import { Snackbar, SnackbarContent } from "@mui/material";
import EditPlasterAndMortarModal from "../Modals/EditPlasterAndMortarModal";

export default function MorterAndPlasterRequestsTAB() {
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
    let urlapi = "api/PlasterMortarProduction/production-order?";

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
  const [isOpenQrCodeModal, setIsOpenQrCodeModal] = useState(false);

  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), [
    date,
    search,
    selectValue,
  ]);
  const statusList = [
    { id: "Pending", value: "Pending" },
    { id: "Accepted", value: "Accepted" },
    { id: "Rejected", value: "Rejected" },
    /*  { id: "Confirmed", value: "Confirmed" }, */
  ];

  const updateDates = (newDate1, newDate2) => {
    setDate([newDate1, newDate2]);
  };

  const headCells = [
    {
      id: "ID",
      numeric: false,
      disablePadding: true,
      label: "ID",
    },
    {
      id: "MixingRequest",
      numeric: true,
      disablePadding: false,
      label: "Mixing Request",
    },
    /*   {
      id: "MirRequest",
      numeric: true,
      disablePadding: false,
      label: "Mir Request",
    }, */
    {
      id: "Quantity",
      numeric: true,
      disablePadding: false,
      label: "Quantity",
    },
    {
      id: "SoilStorage",
      numeric: true,
      disablePadding: false,
      label: "Soil Storage",
    },
    {
      id: "ProductionDate",
      numeric: true,
      disablePadding: false,
      label: "Production Date",
    },
    {
      id: "QRCode",
      numeric: true,
      disablePadding: false,
      label: "QR Code",
    },
    {
      id: "Status",
      numeric: true,
      disablePadding: false,
      label: "Status",
    },
  ];
  const handleOpenQrCode = (id) => {
    setSelectedId(id);
    setIsOpenQrCodeModal(true);
  };
  const row = data?.map((elem) => {
    return {
      id: elem.id,
      ID: elem.id,
      MixingRequest: elem.mixingRequest.mixingNumberRequest,
      MirRequest: "",
      Quantity: elem.quantity,
      SoilStorage: elem.soilStorage,
      ProductionDate: formatDate(elem.prodcutionOrderDate),
      QRCode: (
        <button onClick={() => handleOpenQrCode(elem.id)}>
          <i className="fa fa-qrcode text-2xl text-blue-400 mr-4 hover:text-blue-600"></i>
        </button>
      ),
      Status: elem.status,
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
    setSnackMessage("Mixing Request Updated Successfully");
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
      await axios.delete(
        `api/PlasterMortarProduction/production-order/${selectedId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
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
        rows={row || []}
        headCells={headCells}
        toolbar={["Edit", "Delete", "Print"]}
        onEdit={handleOpenEditeodal}
        onDelete={handleOpenDeleteodal}
        loading={isLoading}
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
      {isOpenQrCodeModal && (
        <QrCodeModal
          cancelFcn={() => setIsOpenQrCodeModal(false)}
          saveFcn={() => setIsOpenQrCodeModal(false)}
          closeModal={() => setIsOpenQrCodeModal(false)}
          title={"Qr Code"}
          type={"Print"}
          withCancel={false}
          data={data.find((elem) => elem.id === selectedId)}
        />
      )}
      {isEditModalOpen && (
        <EditPlasterAndMortarModal
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
