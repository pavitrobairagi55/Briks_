import { useContext, useEffect, useState } from "react";

import Modal from "../../../components/Modal";
import EnhancedTable from "../../../components/tabel/Table";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
import useFetch from "../../../shared/useFetch";

export default function DispatchModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
  data,
}) {
  const id = data.id;
  const [zone, setZone] = useState();
  const [zoneList, setZoneList] = useState([]);
  const [requestsList, setRequestsList] = useState([]);
  const [transportationMode, setTransportationMode] = useState();

  const [quantity, setQuantity] = useState(data.loadQuantity);
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();
  const { data: dispatchRow } = useFetch(`CustomerTrips/${data.id}/dispatches`);

  const auth = useContext(AuthContext);

  const [dispatchNumber, setDispatchNumber] = useState();
  const [oldDispatchValue, setOldDispatchValue] = useState();

  const headCells = [
    /* {
      id: "Id",
      numeric: false,
      disablePadding: true,
      label: "Id",
    }, */
    {
      id: "Quantity",
      numeric: false,
      disablePadding: false,
      label: "Quantity",
    },
    {
      id: "WareHouseName",
      numeric: true,
      disablePadding: false,
      label: "WareHouse Name",
    },
    {
      id: "ZoneName",
      numeric: true,
      disablePadding: false,
      label: "Zone Name",
    },
  ];
  const rows = dispatchRow?.map((elem) => {
    return {
      id: elem.id,
      Id: elem.id,
      Quantity: elem.quantity.toFixed(2),
      WareHouseName: elem.warehouse,
      ZoneName: elem.zoneName,
    };
  });

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      const response = await axios.get(
        `api/CustomerOrders/zones/${data?.customerOrderId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      setZoneList(response.data);
    } catch (error) {}

    try {
      const response = await axios.get(
        `/api/CustomerTrips/next-dispatch-number`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setDispatchNumber(response.data.nextDispatchNumber);
      setOldDispatchValue(response.data.nextDispatchNumber);
    } catch (error) {}
  };

  const saveData = async () => {
    if (data?.status?.secretCode === "dispatched") {
      setError(`Trip Already dispatched`);
      preceed = false;
      return;
    }
    let preceed = true;
    if (!zone || !dispatchNumber || !quantity) {
      setError("Please fullfill all the requested infomation");
      preceed = false;
      return;
    }

    if (quantity > data.loadQuantity) {
      setError(`Quantity should be equal or less than ${data.loadQuantity}`);
      preceed = false;
      return;
    }

    if (dispatchNumber < oldDispatchValue) {
      setError(
        `Dispatch Number should be equal or greater than ${oldDispatchValue}`
      );
      preceed = false;
      return;
    }
    if (preceed) {
      setIsLoading(true);
      try {
        const input = {
          zoneId: +zone,
          dispatchNumber: +dispatchNumber,
          quantity: +quantity,
          transportationType: transportationMode,
        };

        await axios.put(`/api/customerTrips/${id}/dispatch`, input, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        });

        saveFcn();
      } catch (error) {
        setIsLoading(false);

        setError(JSON.parse(error.request.response).title);
      }
    }
  };

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
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Zone</label>
              <select
                className="w-full px-3 py-2 border rounded-lg text-gray-700"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
              >
                <option value={null}>Select Zone</option>
                {zoneList.map((elem) => (
                  <option value={elem.id}>{elem.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Quantity</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg text-gray-700"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                }}
              />
            </div>
            <div>
              <label className="block mb-2">Dispatch Number</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg text-gray-700"
                value={dispatchNumber}
                onChange={(e) => {
                  setDispatchNumber(e.target.value);
                }}
              />
            </div>
            <div>
              <label className="block mb-2">Transportation Mode</label>
              <select
                className="w-full px-3 py-2 border rounded-lg text-gray-700"
                value={transportationMode}
                onChange={(e) => setTransportationMode(e.target.value)}
              >
                <option value={null}>select Mode</option>
                <option value={"FOT"}>FOT</option>
                <option value={"DLD"}>{"DLD"}</option>
              </select>
            </div>

            <span className="font-semibold text-red-500">{error} </span>
            <div></div>
          </div>
          <EnhancedTable rows={rows || []} headCells={headCells} />{" "}
        </div>
      </Modal>
    </>
  );
}
