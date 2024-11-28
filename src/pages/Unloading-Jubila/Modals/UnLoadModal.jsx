import { useContext, useEffect, useState } from "react";

import Modal from "../../../components/Modal";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";
import useFetch from "../../../shared/useFetch";

export default function UnLoadModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
  data,
}) {
  const auth = useContext(AuthContext);
  const [error, setError] = useState();
  const [warning, setWarning] = useState();

  const { data: alJubilaZones } = useFetch("Zones/soil-al-jubila");

  const [weighingBridgeJubila, setWeighingBridgeJubila] = useState(
    data.weighingBridgeAlQasaab
  );
  const [qbmReceived, setQbmReceived] = useState();

  const [
    userNameRecordWeighingBridgeJubila,
    serUserNameRecordWeighingBridgeJubila,
  ] = useState();
  const [alJubilaZoneId, setAlJubilaZoneId] = useState();

  const saveData = async () => {
    setError(null);
    try {
      const input = {
        id: data.id,
        weighingBridgeJubila: +weighingBridgeJubila,
        userNameRecordWeighingBridgeJubila: userNameRecordWeighingBridgeJubila,
        alJubilaZoneId: +alJubilaZoneId,
        QbmReceived: +weighingBridgeJubila /* qbmReceived */,
      };
      await axios.put(`api/Trips/unloading-jubila`, input, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      saveFcn();
    } catch (error) {
      if (error.request.response) {
        setError(JSON.parse(error.request.response).title);
      } else {
        setError("Error");
      }
    }
  };
  useEffect(() => {
    setQbmReceived(+weighingBridgeJubila / 1.5);
    if (weighingBridgeJubila > data.weighingBridgeAlQasaab) {
      setWarning(
        "Warning: Quantity is more than the original quantity by " +
          (weighingBridgeJubila - data.weighingBridgeAlQasaab)
      );
    } else if (weighingBridgeJubila < data.weighingBridgeAlQasaab) {
      setWarning(
        "Warning: Quantity is less than the original quantity by " +
          (data.weighingBridgeAlQasaab - weighingBridgeJubila)
      );
    } else {
      setWarning("");
    }
  }, [weighingBridgeJubila]);

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
            <label className="block mb-2">Weighing Bridge Jubila</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={weighingBridgeJubila}
              onChange={(e) => {
                setWeighingBridgeJubila(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block mb-2">
              User Name Record Weighing Bridge Jubila
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={userNameRecordWeighingBridgeJubila}
              onChange={(e) => {
                serUserNameRecordWeighingBridgeJubila(e.target.value);
              }}
            />
          </div>

          <div>
            <label className="block mb-2">AlJubila Zone</label>
            <select
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={alJubilaZoneId}
              onChange={(e) => setAlJubilaZoneId(e.target.value)}
            >
              <option value="">Select Option</option>
              {alJubilaZones?.map((elem) => (
                <option value={elem.id} key={elem.id}>
                  {elem.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">QbmReceived</label>
            <input
              disabled
              type="number"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={qbmReceived}
              onChange={(e) => {
                setQbmReceived(e.target.value);
              }}
            />
          </div>
          <span className="font-semibold text-orange-500">{warning} </span>

          <span className="font-semibold text-red-500">{error} </span>
        </div>
      </Modal>
    </>
  );
}
