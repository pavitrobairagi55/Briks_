import { useContext, useEffect, useState } from "react";

import Modal from "../../../components/Modal";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";

export default function ApproveModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
  statusList,
  data,
}) {
  const orderID = data?.id;
  const [status, setStatus] = useState();
  const [allocatedQuantity, setAllocatedQuantity] = useState(data.quantity);
  const [orderPriority, setOrderPriority] = useState();
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState();
  const [error, setError] = useState();
  const auth = useContext(AuthContext);
  const [balance, setBalance] = useState();
  const [subtotalUnderProcessingQuantity, setSubtotalUnderProcessingQuantity] =
    useState();

  const saveData = async () => {
    let proceed = true;

    setError(null);
    if (
      status !== "rejected" &&
      status !== "accepted" &&
      status !== "rescheduled"
    ) {
      setError("Please select the correct status");
      proceed = false;
      return;
    }
    if (allocatedQuantity > data.quantity) {
      setError(`Allocated Quantity should be less than ${data.quantity}`);
      proceed = false;
    }

    if (allocatedQuantity && allocatedQuantity < 0) {
      setError("Allocated Quantity should be bigger than 0");
      proceed = false;
    } else if (orderPriority && (orderPriority < 0 || orderPriority > 100)) {
      setError("Order Priority should be between 0 and 100");
      proceed = false;
    } else if (
      expectedDeliveryDate &&
      new Date(expectedDeliveryDate).getTime() < new Date().getTime()
    ) {
      setError("Wrong Expected Delivery Date");
      proceed = false;
    }

    if (proceed) {
      try {
        if (status === "rejected") {
          const input = {
            setsRejectionNote: " ",
          };
          await axios.put(`api/CustomerOrders/${orderID}/reject`, input, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          });
        } else if (status === "accepted") {
          const input = {
            approvedQuantity: +allocatedQuantity,
            priority: orderPriority,
          };
          await axios.put(`api/CustomerOrders/${orderID}/dgcl-approve`, input, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          });
        } else if (status === "rescheduled") {
          const input = {
            approvedQuantity: +allocatedQuantity,
            priority: orderPriority,
            expectedDeliveryDate: expectedDeliveryDate,
          };
          await axios.put(`api/CustomerOrders/${orderID}/reschedule`, input, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          });
        }
        saveFcn();
      } catch (error) {
        if (error.request.response) {
          setError(JSON.parse(error.request.response).title);
        } else {
          setError("Error");
        }
      }
    }
  };

  useEffect(() => {
    if (allocatedQuantity) {
      calculateBalance();
    }
  }, [allocatedQuantity]);
  const calculateBalance = async () => {
    try {
      const response = await axios.get(
        `/api/inventory/calculate-product-stats?productId=${data.product.id}&OldQuantity=${data.quantity}&NewQuantity=${allocatedQuantity}`,
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
              <option value={null}>Select Option</option>

              {statusList?.map((elem) => (
                <option value={elem.id}>{elem.value}</option>
              ))}
            </select>
          </div>
          {status !== "rejected" && (
            <div>
              <label className="block mb-2">Allocated Quantity</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg text-gray-700"
                value={allocatedQuantity}
                onChange={(e) => {
                  setAllocatedQuantity(e.target.value);
                }}
              />
            </div>
          )}
          {status == "rescheduled" && (
            <div>
              <label className="block mb-2">Expected Delivery Date</label>
              <input
                required
                type="date"
                className="w-full px-3 py-2 border rounded-lg text-gray-700"
                value={expectedDeliveryDate}
                onChange={(e) => setExpectedDeliveryDate(e.target.value)}
              />
            </div>
          )}

          {status !== "rejected" && (
            <div>
              <label className="block mb-2">Order Priority</label>
              <select
                className="w-full px-3 py-2 border rounded-lg text-gray-700"
                value={orderPriority}
                onChange={(e) => setOrderPriority(e.target.value)}
              >
                <option value={null}>select Priority</option>
                <option value={"High"}>High</option>
                <option value={"Medium"}>Medium</option>
              </select>
            </div>
          )}
          {status !== "rescheduled" && <div></div>}

          <div>
            Customer Order Quantity:{" "}
            <span className="font-semibold">
              {" "}
              {data.quantity * data.quantityPerUnit}{" "}
            </span>
            Customer Order Quantity By {data.masterUnitName}:{" "}
            <span className="font-semibold"> {data.quantity} </span>
          </div>
          <div></div>
          {balance && (
            <>
              <div>
                <div>
                  Subtotal For Free By {data.masterUnitName}:{" "}
                  <span className="font-semibold">
                    {" "}
                    {balance.subTotalFreeByPiece.toFixed(2)}{" "}
                  </span>
                </div>
                <div>
                  Subtotal Free:{" "}
                  <span className="font-semibold">
                    {" "}
                    {balance.subTotalFree.toFixed(2)}{" "}
                  </span>
                </div>
                <div>
                  Subtotal Under Processing Quantity:{" "}
                  <span className="font-semibold">
                    {" "}
                    {balance.subTotalUnderProcessing.toFixed(2)}{" "}
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
