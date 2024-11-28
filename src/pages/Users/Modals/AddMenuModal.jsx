import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
import Modal from "../../../components/Modal";

export default function AddMenuModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
}) {
  const auth = useContext(AuthContext);
  const [name, setName] = useState();
  const [url, setUrl] = useState();
  const [icon, setIcon] = useState();
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();
  const saveData = async () => {
    if (!name || !url || !icon) {
      setError("Please fullfill all the requested infomation");
      return;
    }
    setIsLoading(true);
    try {
      const input = {
        url,
        name,
        icon,
      };

      await axios.post(`api/menus`, input, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      saveFcn();
    } catch (error) {
      console.log("🚀 ~ saveData ~ error:", error);
      setIsLoading(false);

      setError(error.response?.data);
    }
  };

  return (
    <>
      <Modal
        showSave={true}
        title={title}
        closeModal={closeModal}
        type={type}
        saveFcn={saveData}
        cancelFcn={cancelFcn}
        withCancel={withCancel}
        isLoading={isLoading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={name}
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
              onChange={(e) => {
                setUrl(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block mb-2">Icon</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={icon}
              onChange={(e) => {
                setIcon(e.target.value);
              }}
            />
          </div>
        </div>
        <span className="font-semibold text-red-500">{error} </span>
      </Modal>
    </>
  );
}
