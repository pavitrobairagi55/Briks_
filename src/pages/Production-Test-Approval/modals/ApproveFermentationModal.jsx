import { useContext, useState } from "react";
import Modal from "../../../components/Modal";

import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";

export default function ApproveFermentationModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
  data,
}) {
  const auth = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();
  const [status, setStatus] = useState();
  const [note, setNote] = useState();

  const statusList = [
    { id: "Accepted", value: "Accepted" },
    { id: "Rejected", value: "Rejected" },
  ];

  const saveData = async () => {
    if (!status) {
      setError("Please fullfill all the requested infomation");
      return;
    }
    setIsLoading(true);

    let url =
      status.toLowerCase() === "accepted"
        ? `api/Fermentation/approve/${data.id}`
        : status.toLowerCase() === "rejected"
        ? `api/Fermentation/reject/${data.id}`
        : null;

    url += `?notes=${note}`;

    if (url) {
      try {
        await axios.post(
          url,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        saveFcn();
      } catch (error) {
        console.log("🚀 ~ saveData ~ error:", error);
        setIsLoading(false);

        setError(error.response?.data);
      }
    }
    setIsLoading(false);
  };

  return (
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
      <div className="  w-full gap-7">
        <div className="w-full flex justify-between gap-7 mb-7 flex-row ">
          <div className="w-1/2 sm:w-full">
            <h4>Select Status</h4>
            <select
              className="w-full px-3 py-2 border rounded-lg text-gray-700 "
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">select Status</option>
              {statusList?.map((elem, index) => (
                <option key={index} value={elem.id}>
                  {elem.value}
                </option>
              ))}
            </select>
          </div>
          {status?.toLowerCase() === "rejected" && (
            <div className="w-1/2 sm:w-full">
              <h4>Note</h4>
              <input
                className="w-full px-3 py-2 border rounded-lg text-gray-700"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          )}
          {status?.toLowerCase() !== "rejected" && (
            <div className="w-1/2 sm:w-full"></div>
          )}
        </div>{" "}
        <span className="font-semibold text-red-500">{error} </span>
      </div>
    </Modal>
  );
}
