import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";

import Modal from "../../../components/Modal";
import { capitalizeFirstLetter, formatDate } from "../../../utils";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import useFetch from "../../../shared/useFetch";
import EnhancedTable from "../../../components/tabel/Table";

export default function AddPlasterAndMortarModal({
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

  const { data: plasterAreas } = useFetch(
    "PlasterMortarProduction/plaster-area"
  );
  const { data: mortarAreas } = useFetch("PlasterMortarProduction/mortar-area");

  const [error, setError] = useState();
  const [typeId, setTypeId] = useState();
  const [mixingId, setMixingId] = useState(data.id);
  const [soilStorage, setSoilStorage] = useState();
  const [prodcutionOrderDate, setProdcutionOrderDate] = useState();
  const [quantity, setQuantity] = useState();
  const [issueDate, setIssueDate] = useState();
  const [stockPileArea, setStockPileArea] = useState();
  const [stockList, setStockList] = useState([]);
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
        prodcutionOrderDate: prodcutionOrderDate,
        issueDate: issueDate,
        productType: typeId,
        quantity: quantity,
        pileAreaId: stockPileArea,
      };

      await axios.post("api/PlasterMortarProduction/production-order", input, {
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

  const headCells = [
    {
      id: "MixingRequest",
      numeric: false,
      disablePadding: true,
      label: "Mixing Request",
    },
    {
      id: "RedClay",
      numeric: true,
      disablePadding: false,
      label: "Red Clay",
    },
    {
      id: "FermentationPlan",
      numeric: true,
      disablePadding: false,
      label: "Stockpile",
    },
    {
      id: "StartDate",
      numeric: true,
      disablePadding: false,
      label: "Create Date",
    },
  ];
  const row = [data]?.map((elem) => {
    return {
      id: elem.id,
      MixingRequest: elem.mixingNumberRequest,
      FermentationPlan: elem.fermentationZone.name,
      StartDate: formatDate(elem.mixingDate),
      RedClay: elem.redClay,
    };
  });

  useEffect(() => {
    if (
      typeId &&
      typeList
        ?.find((elem) => elem.id.toString() === typeId.toString())
        ?.value?.toLowerCase() === "plaster"
    ) {
      setStockList(plasterAreas);
    } else if (
      typeId &&
      typeList
        ?.find((elem) => elem.id.toString() === typeId.toString())
        ?.value?.toLowerCase() === "mortar"
    ) {
      setStockList(mortarAreas);
    } else {
      setStockList([]);
    }
  }, [typeId]);
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
            <select
              disabled
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={mixingId}
            >
              {[data].map((elem, i) => (
                <option key={i} value={elem.id}>
                  {elem.mixingNumberRequest}
                </option>
              ))}
            </select>
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
            <DatePicker
              value={prodcutionOrderDate}
              onChange={(date) =>
                setProdcutionOrderDate(dayjs(date).format("YYYY-MM-DD"))
              }
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
            <DatePicker
              value={issueDate}
              onChange={(date) =>
                setIssueDate(dayjs(date).format("YYYY-MM-DD"))
              }
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
        <EnhancedTable rows={row || []} headCells={headCells} />
      </Modal>
    </>
  );
}
