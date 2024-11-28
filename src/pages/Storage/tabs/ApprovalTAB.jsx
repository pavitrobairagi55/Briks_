import { useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import UseFetchData from "../../../shared/useFetchData";
import { formatDate } from "../../../utils";
import QrCodeModal from "../modals/QrCodeModal";

export default function ApprovalTAB() {
  const [search, setSearch] = useState();
  const [date, setDate] = useState();
  const [selectValue, setSelectValue] = useState();
  const [isOpenQrCodeModal, setIsOpenQrCodeModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const getFilteredURL = () => {
    let urlapi = "api/Approval?";

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
    selectValue,
  ]);
  const statusList = [
    { id: "Pending", value: "Pending" },
    { id: "Accepted", value: "Accepted" },
    { id: "Rejected", value: "Rejected" },
  ];
  const updateDates = (newDate1, newDate2) => {
    setDate([newDate1, newDate2]);
  };

  const handleOpenQrCode = (id) => {
    setSelectedId(id);
    setIsOpenQrCodeModal(true);
  };
  const headCells = [
    {
      id: "ApprovalRequest",
      numeric: false,
      disablePadding: true,
      label: "Approval Request",
    },
    {
      id: "mixingRequest",
      numeric: true,
      disablePadding: false,
      label: "Mixing Request",
    },
    {
      id: "ApprovalLWire",
      numeric: true,
      disablePadding: false,
      label: "Approval LWire",
    },
    {
      id: "StorageRequest",
      numeric: true,
      disablePadding: false,
      label: "Storage Request",
    },
    {
      id: "Status",
      numeric: true,
      disablePadding: false,
      label: "Status",
    },
    {
      id: "QRCode",
      numeric: true,
      disablePadding: false,
      label: "QR Code",
    },
  ];

  const rows = data?.map((elem) => {
    return {
      id: elem.id,
      mixingRequest: elem.mixingRequest.mixingNumberRequest,
      ApprovalRequest: elem.id,
      ApprovalLWire: elem.approvalWire,
      StorageRequest: elem.storageRequest.id,
      Status: elem.status,
      QRCode: (
        <button onClick={() => handleOpenQrCode(elem.id)}>
          <i className="fa fa-qrcode text-2xl text-blue-400 mr-4 hover:text-blue-600"></i>
        </button>
      ),
    };
  });

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
        rows={rows || []}
        headCells={headCells}
        loading={isLoading}
      />
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
    </>
  );
}
