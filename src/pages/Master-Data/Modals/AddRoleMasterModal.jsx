import { useContext, useEffect, useState } from "react";

import Modal from "../../../components/Modal";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";

export default function AddRoleMasterModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
}) {
  const [name, setName] = useState();
  const [error, setError] = useState();

  const [description, setDescription] = useState();

  const auth = useContext(AuthContext);

  /*   const saveData = async () => {
    try {
      if (status === "Rejected") {
        const input = {
          setsRejectionNote: note,
        };
        await axios.put(`api/CustomerOrders/${orderID}/reject`, input, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        });
      } else if (status === "Verified") {
        await axios.put(
          `api/CustomerOrders/${orderID}/sets-approve`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
      }
      saveFcn();
    } catch (error) {
      setError("Error");
    }
  }; */
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
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>

          <div></div>
          <div>
            <label className="block mb-2">Description</label>
            <textarea
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>

          <span className="font-semibold text-red-500">{error} </span>
        </div>
      </Modal>
    </>
  );
}
