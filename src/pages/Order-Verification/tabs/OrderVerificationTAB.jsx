import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { AuthContext } from "../../../shared/authContext";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import axios from "../../../api/axios";
import { formatDate } from "../../../utils";
import DeleteModal from "../../../components/DeleteModal";
import TripDetailsModal from "../Modals/TripDetailsModal";
import ViewTripDetailsModal from "../Modals/ViewTripDetailsModal";
import VerificationFormModal from "../Modals/VerificationFormModal";
import UseFetchData from "../../../shared/useFetchData";

export default function OrderVerificationTAB() {
  const [search, setSearch] = useState();
  const [date, setDate] = useState();
  const [selectValue, setSelectValue] = useState();
  const [statusList, setStatusList] = useState([]);

  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isTripViewModalOpen, setTripViewModalOpen] = useState(false);
  const [isVerifiedViewModalOpen, setVerifiedViewModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const handleAddSnackBar = () => {
    setSnackMessage("Status Updated");
    setOpenSnackBar(true);
    handleRefetech();
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 2000);
  };

  const getFilteredURL = () => {
    /*     let urlapi = "api/CustomerOrders/status/Pending?";
     */
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
    if (selectValue?.length) {
      urlapi +=
        (urlapi[urlapi.length - 1] === "?" ? "" : "&") +
        "status=" +
        selectValue;
    }
    return urlapi;
  };
  const { isLoading, data, refetch } = UseFetchData(getFilteredURL(), [
    date,
    search,
    selectValue,
  ]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const statusresponse = await axios.get(
          "api/MasterStatusCustomerOrder",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        const statusMap = statusresponse.data?.map((elem) => {
          return {
            id: elem.secretCode,
            value: elem.name,
          };
        });

        setStatusList(statusMap);
      } catch (error) {}
    };

    fetchStatus();
  }, []);
  const horizontal = "center";
  const vertical = "top";

  const handleOpenViewModal = (id) => {
    setSelectedId(id);
    setViewModalOpen(true);
  };
  const handleCloseViewModal = () => {
    setViewModalOpen(false);
  };

  const handleOpenTripViewModal = (id) => {
    setSelectedId(id);
    setTripViewModalOpen(true);
  };
  const handleCloseTripViewModal = () => {
    setTripViewModalOpen(false);
  };

  const handleOpenVerifiedViewModal = (id) => {
    setSelectedId(id);
    setVerifiedViewModalOpen(true);
  };
  const handleCloseVerifiedViewModal = () => {
    setVerifiedViewModalOpen(false);
  };

  const updateDates = (newDate1, newDate2) => {
    setDate([newDate1, newDate2]);
  };
  const auth = useContext(AuthContext);

  const Buttons = ({ id, title, openModalFCN, status }) => {
    return (
      <IconButton
        disabled={status !== "Pending"}
        onClick={() => openModalFCN(id)}
        className="text-white bg-[#3B81F6] hover:text-[#3B81F6] hover:bg-white rounded-2xl text-lg"
      >
        {title}
      </IconButton>
    );
  };

  const rows = data.map((elem) => {
    return {
      id: elem.id,
      Product: elem.product?.name,
      CreatedDate: formatDate(elem.createdDate),
      OrderNumber: elem.id,
      ExpectedDeliveryDate: formatDate(elem.expectedDeliveryDate),
      Quanity: elem.quantity.toFixed(2),
      OrderStatus: elem.status?.name,
      TripDetails: (
        <Buttons
          status={elem.status?.name}
          id={elem.id}
          title={"View"}
          openModalFCN={handleOpenTripViewModal}
        />
      ),
      View: (
        <Buttons
          status={elem.status?.name}
          id={elem.id}
          title={"View"}
          openModalFCN={handleOpenViewModal}
        />
      ),
      ChangeStatus: (
        <Buttons
          status={elem.status?.name}
          id={elem.id}
          title={"Verified"}
          openModalFCN={handleOpenVerifiedViewModal}
        />
      ),
    };
  });

  const headCells = [
    {
      id: "Product",
      numeric: false,
      disablePadding: true,
      label: "Product",
    },
    {
      id: "CreatedDate",
      numeric: true,
      disablePadding: false,
      label: "Created Date",
    },
    {
      id: "OrderNumber",
      numeric: true,
      disablePadding: false,
      label: "Order Number",
    },
    {
      id: "ExpectedDeliveryDate",
      numeric: true,
      disablePadding: false,
      label: "Expected Delivery Date",
    },
    {
      id: "Quanity",
      numeric: true,
      disablePadding: false,
      label: "Quanity",
    },
    {
      id: "OrderStatus",
      numeric: true,
      disablePadding: false,
      label: "Order Status",
    },
    /* {
      id: "TripDetails",
      numeric: true,
      disablePadding: false,
      label: "Trip Details",
    }, */
    {
      id: "View",
      numeric: true,
      disablePadding: false,
      label: "View",
    },
    {
      id: "ChangeStatus",
      numeric: true,
      disablePadding: false,
      label: "Change Status",
    },
  ];
  const handleRefetech = () => {
    refetch();
    handleCloseVerifiedViewModal();
  };

  return (
    <>
      <HeaderFilter
        searchExist
        search={search}
        selectChange={(val) => setSelectValue(val.target.value)}
        seachChange={(val) => setSearch(val.target.value)}
        selectExists
        selectValue={selectValue}
        selectOptions={statusList}
        date={date}
        dateChange={updateDates}
        dateExist
        searchPlaceHolder={"Order Number"}
      />
      <EnhancedTable rows={rows} headCells={headCells} loading={isLoading} />
      {isTripViewModalOpen && (
        <TripDetailsModal
          cancelFcn={handleCloseTripViewModal}
          saveFcn={setSnackMessage}
          closeModal={handleCloseTripViewModal}
          title={"Trip Details"}
          type={"Close"}
          withCancel={false}
        />
      )}
      {isViewModalOpen && (
        <ViewTripDetailsModal
          cancelFcn={handleCloseViewModal}
          saveFcn={handleCloseViewModal}
          closeModal={handleCloseViewModal}
          title={"View Details"}
          type={"Close"}
          withCancel={false}
          editable={false}
          data={data.find((elem) => elem.id === selectedId)}
        />
      )}
      {isVerifiedViewModalOpen && (
        <VerificationFormModal
          cancelFcn={handleCloseVerifiedViewModal}
          saveFcn={handleAddSnackBar}
          closeModal={handleCloseVerifiedViewModal}
          title={"Verification Form"}
          type={"Confirm"}
          withCancel={true}
          editable={false}
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
