import { useContext, useState } from "react";
import Modal from "../../../components/Modal";
import useFetch from "../../../shared/useFetch";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";

export default function ChangeStatus({
  title,
  Editable,
  cancelFcn,
  closeModal,
  saveFcn,
  type,
  withCancel,
  data,
}) {
  const auth = useContext(AuthContext);
  const [error, setError] = useState();
  const [status, setStatus] = useState();
  const [statusList, setStatusList] = useState();

  const [isLoading, setIsLoading] = useState();
  /* const saveData = async () => {
    if (!product || !date || !quantity) {
      setError("Please fullfill all the requested infomation");
      return;
    }

    setIsLoading(true);
    try {
      const input = {
        productId: product,
        productionDate: Array.isArray(date) ? date[0] : date,
        quantity: quantity,
      };

      await axios.put(`api/ProductionOrders/${data.id}`, input, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      saveFcn();
    } catch (error) {
      console.log("🚀 ~ saveData ~ error:", error);
      setIsLoading(false);

      setError(JSON.parse(error.request.responseText).title);
    }
  }; */
  return (
    <Modal
      showSave={true}
      title={title}
      Editable={Editable}
      cancelFcn={cancelFcn}
      closeModal={closeModal}
      saveFcn={saveFcn}
      type={type}
      withCancel={withCancel}
      isLoading={isLoading}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Change Status</label>
          <select
            required
            className="w-full px-3 py-2 border rounded-lg text-gray-700"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statusList?.map((elem, i) => (
              <option key={i} value={elem?.id}>
                {elem?.name}
              </option>
            ))}
          </select>
        </div>
        <div></div>

        <span className="font-semibold text-red-500">{error} </span>
      </div>
    </Modal>
  );
}
