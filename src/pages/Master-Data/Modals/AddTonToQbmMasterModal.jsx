import { useContext, useEffect, useState } from "react";

import Modal from "../../../components/Modal";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";

export default function AddTonToQbmMasterModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
}) {
  const [Factor, setFactor] = useState();
  const [error, setError] = useState();

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
            <label className="block mb-2">Factor</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={Factor}
              onChange={(e) => {
                setFactor(e.target.value);
              }}
            />
          </div>

          <div></div>

          <span className="font-semibold text-red-500">{error} </span>
        </div>
      </Modal>
    </>
  );
}
