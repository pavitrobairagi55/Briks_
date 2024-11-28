import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../../shared/authContext";
import Modal from "../../../components/Modal";
import useFetch from "../../../shared/useFetch";
import EnhancedTable from "../../../components/tabel/Table";
import { formatDate } from "../../../utils";
import axios from "../../../api/axios";

export default function AddFermentationModal({
  title,
  Editable,
  cancelFcn,
  closeModal,
  saveFcn,
  type,
  withCancel,
  data,
}) {
  const [fermentationData, setFermentationData] = useState();
  const [strawQuantity, setStrawQuantity] = useState();
  const [waterQuantity, setWaterQuantity] = useState();

  const [error, setError] = useState();
  const [fermentationDate, setFermentationDate] = useState();
  const [strawStorage, setStrawStorage] = useState();
  const [waterStorage, setWaterStorage] = useState();

  const [calculatedValue, setCalculatedValue] = useState();
  const [strawStorageList, setStrawStorageList] = useState();
  const [waterStorageList, setWaterStorageList] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const auth = useContext(AuthContext);

  const saveData = async () => {
    if (
      !fermentationDate ||
      !strawStorage ||
      !waterStorage ||
      !calculatedValue
    ) {
      setError("Please fullfill all the requested infomation");
      return;
    }

    setIsLoading(true);

    try {
      const input = {
        mixingRequestId: data.id,
        fermintationDate: fermentationDate,
        strawZoneId: +strawStorage,
        waterZoneId: +waterStorage,
        strawQuantity: fermentationData?.strawQuantity,
        waterQuantity: fermentationData?.waterQuantity,
        days: +calculatedValue,
      };

      await axios.post("api/Fermentation", input, {
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
      id: "Quantity",
      numeric: true,
      disablePadding: false,
      label: "Quantity",
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
      label: "Fermentation Pan",
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
      Quantity: elem.mirRequest.quantity,
      StartDate: formatDate(elem.mixingDate),
      RedClay: elem.redClay,
    };
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `api/Fermentation/load?mixingRequestId=${data.id}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        setStrawQuantity(
          response.data.mixingRequestData.mirRequest.quantity +
            response.data.mixingRequestData.redClay / 100
        );
        setWaterQuantity(
          (response.data.mixingRequestData.mirRequest.quantity +
            response.data.mixingRequestData.redClay / 100) *
            35
        );
        setStrawStorageList(response.data.strawStorage);
        setWaterStorageList(response.data.waterStorage);
      } catch (error) {}
    };

    fetchData();
  }, []);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2">Soil Storage</label>
            <input
              required
              type="date"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={fermentationDate}
              onChange={(e) => {
                setFermentationDate(e.target.value);
              }}
            />
          </div>
          <div></div>
          <div></div>
          <div>
            <label className="block mb-2">Straw Storage</label>
            <select
              required
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={strawStorage}
              onChange={(e) => setStrawStorage(e.target.value)}
            >
              <option value=""></option>
              {strawStorageList?.map((elem, i) => (
                <option key={i} value={elem?.id}>
                  {elem?.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Straw Qty</label>
            <input
              disabled
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={strawQuantity}
            />
          </div>
          <div>
            <label className="block mb-2">Pan QTV Needed * 35</label>
          </div>
          <div>
            <label className="block mb-2">Water Storage</label>
            <select
              required
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={waterStorage}
              onChange={(e) => setWaterStorage(e.target.value)}
            >
              <option value=""></option>
              {waterStorageList?.map((elem, i) => (
                <option key={i} value={elem?.id}>
                  {elem?.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Water Qty</label>
            <input
              disabled
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={waterQuantity}
            />
          </div>
          <div>
            <label className="block mb-2">Pan QTV Needed</label>
          </div>
          <div>
            <label className="block mb-2">
              Calculated From Start Of Mixing Request
            </label>
            <input
              required
              type="number"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={calculatedValue}
              onChange={(e) => {
                setCalculatedValue(e.target.value);
              }}
            />
          </div>
          <div></div>
          <div></div>
          <span className="font-semibold text-red-500">{error} </span>
        </div>
        <EnhancedTable rows={row || []} headCells={headCells} />
      </Modal>
    </>
  );
}
