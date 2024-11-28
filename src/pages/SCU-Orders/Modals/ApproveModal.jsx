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
  data,
}) {
  const StatusList = {
    Approved: "Approved",
    Rejected: "Rejected",
    Rescheduled: "Rescheduled",
  };
  const [status, setStatus] = useState();
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const auth = useContext(AuthContext);

  const saveData = async () => {
    let preceed = true;

    setIsLoading(true);
    let route = "";
    let input = {};
    switch (status) {
      case StatusList.Approved:
        route = `api/customerTrips/${data.id}/approve`;
        break;
      case StatusList.Rejected:
        route = `api/customerTrips/${data.id}/reject`;
        break;
      case StatusList.Rescheduled:
        if (!expectedDeliveryDate) {
          setIsLoading(false);
          preceed = false;
          setError("Please add expected Delivery Date");
          break;
        }
        route = `api/customerTrips/${data.id}/reschedule`;
        input = { expectedDeliveryDate: expectedDeliveryDate };
        break;
      default:
        setIsLoading(false);
        preceed = false;
        setError("Please Select the correct Status");
        return;
    }
    if (preceed) {
      try {
        await axios.put(route, input, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        });

        saveFcn();
      } catch (error) {
        setIsLoading(false);
        if (error.request.response) {
          setError(JSON.parse(error.request.response).title);
        } else setError("Error");
      }
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
        <div className="grid grid-cols-1 md:grid-cols-3 mx-20 ">
          <div>
            <button
              className={
                status === StatusList.Approved
                  ? "bg-green-500 text-white font-semibold py-4 px-6 mb-6"
                  : "bg-green-300 text-white font-semibold py-4 px-6 mb-6"
              }
              onClick={() => setStatus("Approved")}
            >
              Approve
            </button>
          </div>
          <div>
            <button
              className={
                status === StatusList.Rejected
                  ? "bg-red-500 text-white font-semibold py-4 px-6 mb-6"
                  : "bg-red-300 text-white font-semibold py-4 px-6 mb-6"
              }
              onClick={() => setStatus("Rejected")}
            >
              Rejected
            </button>
          </div>
          <div>
            <button
              className={
                status === StatusList.Rescheduled
                  ? "bg-orange-500 text-white font-semibold py-4 px-6 mb-6"
                  : "bg-orange-300 text-white font-semibold py-4 px-6 mb-6"
              }
              onClick={() => setStatus("Rescheduled")}
            >
              Rescheduled
            </button>
          </div>
          <div></div>
          {status === "Rescheduled" && (
            <>
              <div className="mb-10">
                <label className="block mb-2">Expected Delivery Date</label>
                <input
                  required
                  type="date"
                  className="w-full px-3 py-2 border rounded-lg text-gray-700"
                  value={expectedDeliveryDate}
                  onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                />
              </div>
              <div></div>
              <div></div>
            </>
          )}
          <div>
            Load Quantity:{" "}
            <span className="font-semibold"> {data.loadQuantity} </span>
          </div>
          <div></div>

          <span className="font-semibold text-red-500">{error} </span>
        </div>
      </Modal>
    </>
  );
}
