import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../shared/authContext";
import Modal from "../../../components/Modal";

export default function ViewMenuModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
  data,
}) {
  const [name, setName] = useState(data.name);
  const [url, setUrl] = useState(data.route);
  const [icon, setIcon] = useState(data.icon);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={name}
              disabled
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block mb-2">Url</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={url}
              disabled
              onChange={(e) => {
                setUrl(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block mb-2">Icon</label>
            <input
              type="text"
              disabled
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={icon}
              onChange={(e) => {
                setIcon(e.target.value);
              }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
