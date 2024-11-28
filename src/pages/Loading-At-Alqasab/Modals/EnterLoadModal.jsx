import { useContext, useEffect, useState } from "react";

import Modal from "../../../components/Modal";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";
import useFetch from "../../../shared/useFetch";

export default function EnterLoadModal({
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
  const { data: alQasabZones } = useFetch("Zones/soil-al-qasab");

  const [weighingBridgeAlQasaab, setWeighingBridgeAlQasaab] = useState();
  const [
    userNameRecordWeighingBridgeAlqasab,
    setUserNameRecordWeighingBridgeAlqasab,
  ] = useState();
  const [alQasabZoneId, setAlQasabZoneId] = useState();
  const [qbmReceived, setQbmReceived] = useState();

  const saveData = async () => {
    setError(null);
    try {
      const input = {
        id: data.id,
        WeighingBridgeAlQasaab: weighingBridgeAlQasaab,
        UserNameRecordWeighingBridgeAlqasab:
          userNameRecordWeighingBridgeAlqasab,
        AlQasabZoneId: alQasabZoneId,
        QbmReceived: weighingBridgeAlQasaab /* qbmReceived */,
      };
      await axios.put(`api/Trips/loading-qasab`, input, {
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
    setQbmReceived(+weighingBridgeAlQasaab / 1.5);
  }, [weighingBridgeAlQasaab]);

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
            <label className="block mb-2">Weighing Bridge AlQasaab</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={weighingBridgeAlQasaab}
              onChange={(e) => {
                setWeighingBridgeAlQasaab(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block mb-2">
              User Name Record Weighing Bridge AlQasab
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={userNameRecordWeighingBridgeAlqasab}
              onChange={(e) => {
                setUserNameRecordWeighingBridgeAlqasab(e.target.value);
              }}
            />
          </div>

          <div>
            <label className="block mb-2">AlQasab Zone</label>
            <select
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={alQasabZoneId}
              onChange={(e) => setAlQasabZoneId(e.target.value)}
            >
              <option value="">Select Option</option>
              {alQasabZones?.map((elem) => (
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

          <span className="font-semibold text-red-500">{error} </span>
        </div>
      </Modal>
    </>
  );
}
