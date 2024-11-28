import Modal from "../../../components/Modal";

export default function ApprovedQuantityModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
  data,
}) {
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
        <div className="flex items-center justify-center h-full  my-20">
          <span className="font-semibold text-2xl">
            {data.status.name === "DGCL Accepted"
              ? "Approved Quantity : " + data.loadQuantity
              : " DGCL Not Approved"}
          </span>
        </div>
      </Modal>
    </>
  );
}
