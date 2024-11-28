import { useContext, useEffect, useState } from "react";

import Modal from "../../../components/Modal";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";

export default function VerificationFormModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
  data,
}) {
  console.log(
    "🚀 ~ data:",
    data?.product?.name?.toLowerCase()?.includes("athel")
  );
  const [status, setStatus] = useState("");
  const [error, setError] = useState();
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");
  const [balance, setBalance] = useState();

  const statusList = [
    { id: "Verified", value: "Verified" },
    { id: "Rejected", value: "Rejected" },
  ];
  const auth = useContext(AuthContext);
  const orderID = data.id;

  useEffect(() => {
    if (status === "Rejected") {
      setShowNote(true);
    } else {
      setShowNote(false);
    }
  }, [status]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `api/inventory/product-stats/${data.product?.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        setBalance(response.data);
      } catch (error) {
        setError(JSON.parse(error.request.response).title);
      }
    };

    fetchData();
  }, []);
  const saveData = async () => {
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
      if (error.request.response) {
        setError(JSON.parse(error.request.response).title);
      } else setError("Error");
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
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Select Status</label>
            <select
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value={null} key={0}></option>
              {statusList.map((elem) => (
                <option value={elem.id} key={elem.id}>
                  {elem.value}
                </option>
              ))}
            </select>
          </div>
          <div></div>
          {showNote && (
            <div>
              <label className="block mb-2">Note</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg text-gray-700"
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                }}
              />
            </div>
          )}
          {showNote && <div></div>}
          <div>
            Customer Order Quantity :{" "}
            <span className="font-semibold">
              {data?.product?.name?.toLowerCase()?.includes("athel")
                ? data.quantity / 3.5
                : data.quantityPerUnit * data.quantity}{" "}
            </span>
            {"  "}
            Customer Order Quantity By {data.masterUnitName}:{" "}
            <span className="font-semibold">{data.quantity}</span>
          </div>
          <div></div>
          {balance && (
            <>
              <div>
                <div>
                  Subtotal For Free By {data.masterUnitName}:{" "}
                  <span className="font-semibold">
                    {" "}
                    {balance.subTotalFreeByPiece}{" "}
                  </span>
                </div>
                <div>
                  Subtotal Free:{" "}
                  <span className="font-semibold">
                    {" "}
                    {balance.subTotalFree}{" "}
                  </span>
                </div>
                <div>
                  Subtotal Under Processing Quantity:{" "}
                  <span className="font-semibold">
                    {" "}
                    {balance.subTotalUnderProcessing}{" "}
                  </span>
                </div>
              </div>
              <div></div>
            </>
          )}
          <span className="font-semibold text-red-500">{error} </span>
        </div>
      </Modal>
    </>
  );
}
