import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";

import Modal from "../../../components/Modal";
import { capitalizeFirstLetter, formatDate } from "../../../utils";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import useFetch from "../../../shared/useFetch";
import EnhancedTable from "../../../components/tabel/Table";

export default function EditPlasterAndMortarModal({
  title,
  Editable,
  cancelFcn,
  closeModal,
  saveFcn,
  type,
  withCancel,
  data,
}) {
  const { data: typeList } = useFetch("PlasterMortarProduction/type");
  const { data: stockList } = useFetch(
    "PlasterMortarProduction/stock-pile-area"
  );

  const [error, setError] = useState();
  const [typeId, setTypeId] = useState(data.productType);
  const [mixingId, setMixingId] = useState(data.mixingRequest.id);
  const [soilStorage, setSoilStorage] = useState(data.soilStorage);
  const [prodcutionOrderDate, setProdcutionOrderDate] = useState(
    data.prodcutionOrderDate.split("T", 1)
  );
  const [quantity, setQuantity] = useState(data.quantity);
  const [issueDate, setIssueDate] = useState(data.issueDate.split("T", 1));
  const [stockPileArea, setStockPileArea] = useState(data.bileArea.id);

  const [isLoading, setIsLoading] = useState(false);
  const auth = useContext(AuthContext);

  const saveData = async () => {
    if (
      !typeId ||
      !soilStorage ||
      !prodcutionOrderDate ||
      !quantity ||
      !issueDate ||
      !stockPileArea
    ) {
      setError("Please fullfill all the requested infomation");
      return;
    }

    setIsLoading(true);

    try {
      const input = {
        mixingRequestId: mixingId,
        soilStorage: soilStorage,
        prodcutionOrderDate: Array.isArray(prodcutionOrderDate)
          ? prodcutionOrderDate[0]
          : prodcutionOrderDate,
        issueDate: Array.isArray(issueDate) ? issueDate[0] : issueDate,
        productType: typeId,
        quantity: quantity,
        pileAreaId: stockPileArea,
      };

      await axios.put(
        `api/PlasterMortarProduction/production-order/${data.id}`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
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
            <label className="block mb-2">Type Plaster And Morter</label>
            <select
              required
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
            >
              {typeList?.map((elem, i) => (
                <option key={i} value={elem?.id}>
                  {elem?.value}
                </option>
              ))}
            </select>
          </div>
          <div></div>
          <div>
            <label className="block mb-2">Mixing Request</label>
            <input
              disabled
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={data.mixingRequest.mixingNumberRequest}
            />
          </div>
          <div>
            <label className="block mb-2">Soil Storage</label>
            <input
              required
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={soilStorage}
              onChange={(e) => {
                setSoilStorage(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block mb-2">Production Order Date</label>
            <input
              type="date"
              value={prodcutionOrderDate}
              onChange={(e) => setProdcutionOrderDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">QTY</label>
            <input
              required
              type="number"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block mb-2">Issue Date</label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Stock Pile Area </label>
            <select
              required
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={stockPileArea}
              onChange={(e) => setStockPileArea(e.target.value)}
            >
              <option value="">Select Option</option>
              {stockList?.map((elem, i) => (
                <option key={i} value={elem?.id}>
                  {elem?.value}
                </option>
              ))}
            </select>
          </div>
          <span className="font-semibold text-red-500">{error} </span>
        </div>
      </Modal>
    </>
  );
}
