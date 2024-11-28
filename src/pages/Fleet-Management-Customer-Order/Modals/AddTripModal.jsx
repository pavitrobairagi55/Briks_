import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";

import Modal from "../../../components/Modal";
import { addSecondsToTime, convertExistingDate } from "../../../utils";

export default function AddTripModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
  id,
  expectedDate,
}) {
  const [date, setDate] = useState(convertExistingDate(expectedDate));
  const [vehicle, setVehicle] = useState();
  const [vehicleList, setVehicleList] = useState([]);
  const [driver, setDriver] = useState();
  const [transportationMode, setTransportationMode] = useState();
  const [driverList, setDriverList] = useState([]);
  const [fromTime, setFromTime] = useState();
  const [toTime, setToTime] = useState();
  const [loadQuantity, setLoadQuantity] = useState();
  const auth = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    fetchVehicles();
    fetchDrivers();
  }, []);
  const fetchVehicles = async () => {
    try {
      const response = await axios.get("api/CustomerVehicles", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      setVehicleList(response.data);
    } catch (error) {}
  };
  const fetchDrivers = async () => {
    try {
      const response = await axios.get("api/CustomerDrivers", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setDriverList(response.data);
    } catch (error) {}
  };
  const saveData = async () => {
    let preceed = true;

    if (!driver || !vehicle || !loadQuantity || !date || !fromTime || !toTime) {
      setError("Please fullfill all the requested infomation");
      preceed = false;
    }

    if (preceed) {
      setIsLoading(true);
      try {
        const input = {
          customerOrderId: id,
          driverId: +driver,
          vehicleId: +vehicle,
          loadQuantity: +loadQuantity,
          from: addSecondsToTime(fromTime),
          to: addSecondsToTime(toTime),
          /* transportationType: transportationMode, */
        };

        await axios.post("api/CustomerTrips", input, {
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
                <option value={elem.id}>{elem.plateNumber}</option>
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
                <option value={elem.id}>{elem.name}</option>
              ))}
            </select>
          </div>
          {/* <div>
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
          </div> */}
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
            <label className="block mb-2">From Time</label>
            <input
              type="time"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2">To Time</label>
            <input
              type="time"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
            />
          </div>
          {/* <div>
            Customer Order Quantity: <span className="font-semibold">50</span>
          </div>
          <div></div>
          <div>
            Total Load Trip Quantity: <span className="font-semibold">0</span>
          </div>
          <div></div>
          <div>
            Remaining Quantity: <span className="font-semibold">50</span>
          </div>
          <div></div> */}

          <span className="font-semibold text-red-500">{error} </span>
        </div>
      </Modal>
    </>
  );
}
