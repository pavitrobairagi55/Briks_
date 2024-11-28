import { useContext, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import DeleteModal from "../../../components/DeleteModal";
import { Snackbar, SnackbarContent } from "@mui/material";
import { AuthContext } from "../../../shared/authContext";
import UseFetchData from "../../../shared/useFetchData";
import AddMirAthelModal from "../modals/AddMirAthelModal";
import { formatDate } from "../../../utils";
import { APP_URL, VITE_FILE_URL } from "../../../envirement";
import QrCodeModal from "../modals/QrCodeModal";

export default function MirAthel() {
  const auth = useContext(AuthContext);
  const [isOpenQrCodeModal, setIsOpenQrCodeModal] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState();
  const [selectedId, setSelectedId] = useState(null);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [search, setSearch] = useState();
  const [date, setDate] = useState();
  const horizontal = "center";
  const vertical = "top";
  const getFilteredURL = () => {
    let urlapi = "api/AthelWoodClassificationMIR?";

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

    return urlapi;
  };

  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), [
    date,
    search,
  ]);
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
      id: "MirNumber",
      numeric: false,
      disablePadding: true,
      label: "Mir Number",
    },
    {
      id: "SerialNumebr",
      numeric: true,
      disablePadding: false,
      label: "Serial Numebr",
    },
    {
      id: "BatchNumber",
      numeric: true,
      disablePadding: false,
      label: "Batch Number",
    },
    {
      id: "Location",
      numeric: true,
      disablePadding: false,
      label: "Location",
    },
    {
      id: "Date",
      numeric: true,
      disablePadding: false,
      label: "Date",
    },
    {
      id: "ViewFile",
      numeric: true,
      disablePadding: false,
      label: "View File",
    },
    {
      id: "QRCode",
      numeric: true,
      disablePadding: false,
      label: "QR Code",
    },
  ];
  const handleOpenQrCode = (id) => {
    setSelectedId(id);
    setIsOpenQrCodeModal(true);
  };
  const rows = data?.map((elem) => {
    const file = VITE_FILE_URL + elem.mirCopy.path;
    return {
      id: elem.id,
      ID: elem.id,
      MirNumber: elem.mirNumber,
      SerialNumebr: elem.serialNumber,
      BatchNumber: elem.batchNumber,
      Location: elem.sourceLocation,
      Date: formatDate(elem.dateSubmitted),
      ViewFile: (
        <a
          href={file}
          className=" text-blue-400 mr-4 hover:text-blue-600"
          target="_blank"
        >
          View File
        </a>
      ),
      QRCode: (
        <button onClick={() => handleOpenQrCode(elem.id)}>
          <i className="fa fa-qrcode text-2xl text-blue-400 mr-4 hover:text-blue-600"></i>
        </button>
      ),
    };
  });
  const handleSubmitAddModal = () => {
    setSnackMessage(" Added Successfully");
    setOpenSnackBar(true);
    setIsModalOpen(false);
    refetch();
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
        date={date}
        dateChange={updateDates}
        dateExist
      />
      <EnhancedTable
        rows={rows || []}
        headCells={headCells}
        loading={isLoading}
      />
      {isModalOpen && (
        <AddMirAthelModal
          title="Add Mir Athel"
          withCancel
          cancelFcn={() => setIsModalOpen(false)}
          type="Add"
          closeModal={() => setIsModalOpen(false)}
          saveFcn={handleSubmitAddModal}
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
