import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";

import Modal from "../../../components/Modal";
import { addSecondsToTime, convertExistingDate } from "../../../utils";

export default function EditTripModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
  data,
}) {
  const [date, setDate] = useState(convertExistingDate(data.date));
  const [vehicle, setVehicle] = useState(data.vehicle.id);
  const [vehicleList, setVehicleList] = useState([]);
  const [driver, setDriver] = useState(data.driver.id);
  const [driverList, setDriverList] = useState([]);
  const [subItemsList, setSubItemsList] = useState([]);
  const auth = useContext(AuthContext);
  const [loadQuantity, setLoadQuantity] = useState(data?.quantity);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [subItemId, setSubItemId] = useState(data.subItemId);

  useEffect(() => {
    fetchVehicles();
    fetchDrivers();
    fetchSubtems();
  }, []);
  const fetchVehicles = async () => {
    try {
      const response = await axios.get("api/Vehicles", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      setVehicleList(response.data.data);
    } catch (error) {}
  };
  const fetchDrivers = async () => {
    try {
      const response = await axios.get("api/Drivers", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setDriverList(response.data);
    } catch (error) {}
  };
  const fetchSubtems = async () => {
    try {
      const response = await axios.get("api/subitems", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setSubItemsList(response.data);
    } catch (error) {}
  };
  const saveData = async () => {
    setError(null);
    if (!driver || !vehicle || !date || !subItemId) {
      setError("Please fullfill all the requested infomation");
      return;
    }

    setIsLoading(true);
    try {
      const input = {
        Date: Array.isArray(date) ? date[0] : date,
        VehicleId: +vehicle,
        DriverId: +driver,
        ProductionOrderId: data.id,
        SubItemId: subItemId,
        quantity: +loadQuantity,
      };

      await axios.put(`api/Trips/${data.id}`, input, {
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
        isLoading={isLoading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Date</label>
            <input
              disabled
              type="date"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Vehicle</label>
            <select
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
            >
              <option value={null}>Select Option</option>
              {vehicleList.map((elem) => (
                <option value={elem.id}>{elem.vehiclePlateNumber}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Driver</label>
            <select
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={driver}
              onChange={(e) => setDriver(e.target.value)}
            >
              <option value={null}>Select Option</option>

              {driverList.map((elem) => (
                <option value={elem.id}>{elem.driverName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Load Quantity</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={loadQuantity}
              onChange={(e) => setLoadQuantity(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Item</label>
            <select
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={subItemId}
              onChange={(e) => setSubItemId(e.target.value)}
            >
              <option value={null}>Select Option</option>

              {subItemsList.map((elem) => (
                <option value={elem.id}>{elem.name}</option>
              ))}
            </select>
          </div>

          <span className="font-semibold text-red-500">{error} </span>
        </div>
      </Modal>
    </>
  );
}
