import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";

import Modal from "../../../components/Modal";

import EnhancedTable from "../../../components/tabel/Table";
import { formatDate } from "../../../utils";
import useFetch from "../../../shared/useFetch";

export default function AddMoldingRequestModal({
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

  const [moldingDate, setMoldingDate] = useState();
  const [moldingArea, setMoldingArea] = useState();
  const [days, setDays] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const auth = useContext(AuthContext);

  const saveData = async () => {
    const input = {
      bricksProductionOrderId: data.id,
      moldingDate: moldingDate,
      moldingAreaId: moldingArea,
      days: days,
    };
    if (!moldingDate || !moldingArea || !days) {
      setError("Please fullfill all the requested infomation");
      return;
    }

    setIsLoading(true);

    try {
      await axios.post("api/Molding/requests", input, {
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
      id: "BricksType",
      numeric: false,
      disablePadding: true,
      label: "Bricks Type	",
    },
    {
      id: "BricksQuantity",
      numeric: false,
      disablePadding: true,
      label: "Bricks Quantity	",
    },
    {
      id: "ProductionDate",
      numeric: false,
      disablePadding: true,
      label: "Production Date",
    },
  ];
  const row = [data]?.map((elem) => {
    return {
      id: elem.id,
      BricksType: elem.bricksType.name,
      BricksQuantity: elem.bricksQuantity,
      ProductionDate: formatDate(elem.prodcutionOrderDate),
    };
  });

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
              value={" "}
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
        <EnhancedTable rows={row || []} headCells={headCells} />
      </Modal>
    </>
  );
}
