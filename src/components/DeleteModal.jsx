import Modal from "./Modal";

export default function DeleteModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
  error,
  isLoading,
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
        isLoading={isLoading}
      >
        <p className="text-lg text-center text-gray-700 font-semibold mb-4">
          Are you sure you want to delete this element?
        </p>
        {error && <span className="font-semibold text-red-500">{error} </span>}
      </Modal>
    </>
  );
}
