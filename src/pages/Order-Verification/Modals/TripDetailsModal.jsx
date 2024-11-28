import EnhancedTable from "../../../components/tabel/Table";

import Modal from "../../../components/Modal";

export default function TripDetailsModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
}) {
  const headCells = [
    {
      id: "CONumber",
      numeric: false,
      disablePadding: true,
      label: "CONumber",
    },
    {
      id: "DriverName",
      numeric: true,
      disablePadding: false,
      label: "DriverName",
    },
    {
      id: "LoadQuantity",
      numeric: true,
      disablePadding: false,
      label: "Load Quantity",
    },
    {
      id: "TripStatus",
      numeric: true,
      disablePadding: false,
      label: "Trip Status",
    },
    {
      id: "Vehicle",
      numeric: true,
      disablePadding: false,
      label: "Vehicle",
    },
  ];
  return (
    <>
      <Modal
        showSave={true}
        title={title}
        closeModal={closeModal}
        type={type}
        saveFcn={saveFcn}
        cancelFcn={cancelFcn}
        withCancel={withCancel}
      >
        <div className="">
          <EnhancedTable rows={[]} headCells={headCells} />
        </div>
      </Modal>
    </>
  );
}
