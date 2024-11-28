import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";

import Modal from "../../../components/Modal";

import EnhancedTable from "../../../components/tabel/Table";
import { formatDate } from "../../../utils";
import useFetch from "../../../shared/useFetch";

export default function AddProductionOrderModal({
  title,
  Editable,
  cancelFcn,
  closeModal,
  saveFcn,
  type,
  withCancel,
  data,
}) {
  const { data: bricksList } = useFetch("Items/4");
  const { data: moldingAreaList } = useFetch("Molding/areas");

  const [error, setError] = useState();
  const [mixingRequest, setMixingRequest] = useState(
    data.mixingRequest.mixingNumberRequest
  );
  const [productionOrderDate, setProductionOrderDate] = useState();
  const [issueDate, setIssueDate] = useState();
  const [brickType, setBrickType] = useState();
  const [moldingArea, setMoldingArea] = useState();
  const [quantity, setQuantity] = useState();

  const [panNumber, setPanNumber] = useState();
  const [mudStockInPan, setMudStockInPan] = useState();
  const [qtyOfMud, setQtyOfMud] = useState();
  const [balanceOfPan, setBalanceOfPan] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const auth = useContext(AuthContext);

  const saveData = async () => {
    const input = {
      fermintationRequestId: data.id,
      prodcutionOrderDate: productionOrderDate,
      issueDate: issueDate,
      bricksQuantity: quantity,
      mudStockPan: mudStockInPan,
      qtyOMudM3ProduceBricks: qtyOfMud,
      blanceOfPan: balanceOfPan,
      moldingAreaId: moldingArea,
      bricksTypeId: brickType,
    };
    console.log("🚀 ~ saveData ~ input:", input);
    if (
      !balanceOfPan ||
      !qtyOfMud ||
      !productionOrderDate ||
      !quantity ||
      !issueDate ||
      !mudStockInPan ||
      !moldingArea ||
      !brickType
    ) {
      setError("Please fullfill all the requested infomation");
      return;
    }

    setIsLoading(true);

    try {
      await axios.post("api/BricksProductionOrder", input, {
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
      id: "FermentationRequest",
      numeric: false,
      disablePadding: true,
      label: "Fermentation Request",
    },
    {
      id: "FermentationDate",
      numeric: false,
      disablePadding: true,
      label: "Fermentation Date",
    },
    {
      id: "Days",
      numeric: false,
      disablePadding: true,
      label: "Days",
    },
  ];
  const row = [data]?.map((elem) => {
    return {
      id: elem.id,
      FermentationRequest: elem.id,
      FermentationDate: formatDate(elem.fermintationDate),
      Days: elem.days,
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
              value={mixingRequest}
            />
          </div>
          <div>
            <label className="block mb-2">Production Order Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={productionOrderDate}
              onChange={(e) => {
                setProductionOrderDate(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block mb-2">Issue Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={issueDate}
              onChange={(e) => {
                setIssueDate(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block mb-2">Bricks Type</label>
            <select
              required
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={brickType}
              onChange={(e) => setBrickType(e.target.value)}
            >
              <option value="">Bricks Type</option>
              {bricksList?.subItems?.map((elem, i) => (
                <option key={i} value={elem?.id}>
                  {elem?.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Molding Area</label>
            <select
              required
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={moldingArea}
              onChange={(e) => setMoldingArea(e.target.value)}
            >
              <option value="">Molding Area</option>
              {moldingAreaList?.map((elem, i) => (
                <option key={i} value={elem?.id}>
                  {elem?.value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Quantity</label>
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
          {/* <div>
            <label className="block mb-2">Pan Number</label>
            <input
              disabled
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={data?.fermentationZone?.name}
            />
          </div> */}
          <div>
            <label className="block mb-2">Mud Stock In Pan</label>
            <input
              required
              type="number"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={mudStockInPan}
              onChange={(e) => {
                setMudStockInPan(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block mb-2">
              Qty Of Mud M3 To Produce Bricks
            </label>
            <input
              required
              type="number"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={qtyOfMud}
              onChange={(e) => {
                setQtyOfMud(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block mb-2">
              Balance Of Pan After Calculation Bricks
            </label>
            <input
              required
              type="number"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={balanceOfPan}
              onChange={(e) => {
                setBalanceOfPan(e.target.value);
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
