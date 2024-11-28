import { useContext, useState } from "react";
import Modal from "../../../components/Modal";

import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";

export default function MirNotesModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
  data,
}) {
  const [note, setNote] = useState(data.notes);

  return (
    <Modal
      showSave={true}
      title={title}
      closeModal={closeModal}
      type={type}
      saveFcn={saveFcn}
      cancelFcn={cancelFcn}
      withCancel={withCancel}
    >
      <div className="w-full gap-7">
        <span className="font-semibold mt-20">{note} </span>
      </div>
    </Modal>
  );
}
