import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
import Modal from "../../../components/Modal";
import EnhancedTable from "../../../components/tabel/Table";
import { formatDate } from "../../../utils";
import useFetch from "../../../shared/useFetch";

export default function EditMoldingRequestModal({
  title,
  Editable,
  cancelFcn,
  closeModal,
  saveFcn,
  type,
  withCancel,
  data,
}) {
  const { data: moldingAreaList } = useFetch("Molding/areas");

  const [error, setError] = useState();

  const [moldingDate, setMoldingDate] = useState(
    data.moldingDate?.split("T", 1)
  );
  const [moldingArea, setMoldingArea] = useState(data.moldingArea.id);
  const [days, setDays] = useState(data.days);

  const [isLoading, setIsLoading] = useState(false);
  const auth = useContext(AuthContext);

  const saveData = async () => {
    const input = {
      bricksProductionOrderId: data.bricksProductionOrder.id,
      moldingDate: Array.isArray(moldingDate) ? moldingDate[0] : moldingDate,
      moldingAreaId: +moldingArea,
      days: +days,
    };
    if (!moldingDate || !moldingArea || !days) {
      setError("Please fullfill all the requested infomation");
      return;
    }

    setIsLoading(true);

    try {
      await axios.put(`api/Molding/requests/${data.id}`, input, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setIsLoading(false);
      saveFcn();
    } catch (error) {
      setIsLoading(false);
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
        Editable={Editable}
        cancelFcn={cancelFcn}
        closeModal={closeModal}
        saveFcn={saveData}
        type={type}
        withCancel={withCancel}
        isLoading={isLoading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Mixing Request</label>
            <input
              disabled
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={data.mixingRequest.mixingNumberRequest}
            />
          </div>
          <div>
            <label className="block mb-2">Molding Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={moldingDate}
              onChange={(e) => {
                setMoldingDate(e.target.value);
              }}
            />
          </div>

          <div>
            <label className="block mb-2">Bricks Type</label>
            <select
              required
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={moldingArea}
              onChange={(e) => setMoldingArea(e.target.value)}
            >
              <option value="">Bricks Type</option>
              {moldingAreaList?.map((elem, i) => (
                <option key={i} value={elem?.id}>
                  {elem?.value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Days</label>
            <input
              required
              type="number"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={days}
              onChange={(e) => {
                setDays(e.target.value);
              }}
            />
          </div>
          <span className="font-semibold text-red-500">{error} </span>
        </div>
      </Modal>
    </>
  );
}
