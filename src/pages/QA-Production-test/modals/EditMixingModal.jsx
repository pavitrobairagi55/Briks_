import { useContext, useState } from "react";
import Modal from "../../../components/Modal";
import useFetch from "../../../shared/useFetch";
import UseFetchData from "../../../shared/useFetchData";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";

export default function EditMixingModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
  data,
}) {
  console.log("🚀 ~ data:", data);
  const auth = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState();
  const [mixingNumberRequest, setMixingNumberRequest] = useState(
    data.mixingNumberRequest
  );
  const [redClay, setRedClay] = useState(data.redClay);
  const { data: mirList } = useFetch("MirRequests?Status=Accepted");
  const { data: plansList } = useFetch("MixingRequest/fermentation");
  const [mirRequestId, setMirRequestId] = useState(data.mirRequest.id);
  const [fermataionPanId, setFermataionPanId] = useState(
    data.fermentationZone.id
  );
  const [mixingDate, setMixingDate] = useState(data.mixingDate.split("T", 1));

  const [error, setError] = useState();

  const saveData = async () => {
    if (!redClay || !mirRequestId || !fermataionPanId || !mixingDate) {
      setError("Please fullfill all the requested infomation");
      preceed = false;
    }
    setIsLoading(true);
    try {
      const input = {
        mixingNumberRequest,
        redClay,
        mirRequestId,
        fermataionPanId,
        mixingDate: Array.isArray(mixingDate) ? mixingDate[0] : mixingDate,
      };

      await axios.put(`api/MixingRequest/${data.id}`, input, {
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
            <h4>Mixing Number</h4>
            <input
              disabled
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              type="text"
              value={mixingNumberRequest}
            />
          </div>
          <div className="w-1/2 sm:w-full">
            <h4>Mir Request</h4>
            <select
              className="w-full px-3 py-2 border rounded-lg text-gray-700 "
              value={mirRequestId}
              onChange={(e) => setMirRequestId(e.target.value)}
            >
              <option value="">select a storage</option>
              {mirList?.map((elem, index) => (
                <option key={index} value={elem.id}>
                  {elem.mir}
                </option>
              ))}
            </select>
          </div>
        </div>{" "}
        <div className="w-full flex justify-between gap-7 mb-7  ">
          <div className="w-1/2 sm:w-full">
            <h4>Fermataion Pan</h4>
            <select
              className="w-full px-3 py-2 border rounded-lg text-gray-700 "
              value={fermataionPanId}
              onChange={(e) => setFermataionPanId(e.target.value)}
            >
              <option value="">Select option</option>
              {plansList?.map((elem, index) => (
                <option key={index} value={elem.id}>
                  {elem.value}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/2 sm:w-full"> </div>
        </div>
        <div className="w-full flex justify-between gap-7 mb-7  ">
          <div className="w-1/2 sm:w-full">
            <h4>RedClay</h4>
            <input
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              type="number"
              value={redClay}
              onChange={(e) => setRedClay(e.target.value)}
            />
          </div>
          <div className="w-1/2 sm:w-full">
            <h4>Date</h4>
            <input
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              type="date"
              value={mixingDate}
              onChange={(e) => setMixingDate(e.target.value)}
            />
          </div>
        </div>
        <span className="font-semibold text-red-500">{error} </span>
      </div>
    </Modal>
  );
}
