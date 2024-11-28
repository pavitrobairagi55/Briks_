import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";

import Modal from "../../../components/Modal";

export default function EditVehicleModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
  disabled,
  data,
}) {
  const [registrationNumber, setRegistrationNumber] = useState(
    data.registrationNumber
  );
  const [vehiclePlateNumber, setVehiclePlateNumber] = useState(
    data.vehiclePlateNumber
  );
  const [vehicleCapacity, setVehicleCapacity] = useState(data.capacity);
  const [vehicleArabicName, setVehicleArabicName] = useState(
    data.vehicleArabicName
  );
  const [vehicleEnglishName, setVehicleEnglishName] = useState(
    data.vehicleEnglishName
  );
  const [engineNumber, setEngineNumber] = useState(data.engineNumber);
  const [makeModelEnglish, setMakeModelEnglish] = useState(
    data.vehicleModelEnglish
  );
  const [makeModelArabic, setMakeModelArabic] = useState(
    data.vehicleModelArabic
  );
  const [chassisNumber, setChassisNumber] = useState(data.chassisNumber);
  const [colorWithArabic, setColorWithArabic] = useState(
    data.vehicleColorArabic
  );
  const [fuelType, setFuelType] = useState(data.fuelType);
  const [colorWithEnglish, setColorWithEnglish] = useState(
    data.vehicleColorEnglish
  );
  const [secAuxMeter, setSecAuxMeter] = useState(data.auxilaryMeter);
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [vehicleType, setVehiculeType] = useState(data.vehicleType);
  const [vehicleGroup, setVehicleGroup] = useState(data.vehicleGroup);
  const [trackUsageAs, setTrackUsageAs] = useState(data.trackUsageAs);
  const [yearOfManufacture, setYearOfManufacture] = useState(
    data.yearOfManufacture
  );
  const [fuelMeasurementIn, setFuelMeasurementIn] = useState(
    data.fuelMeasurementIn
  );

  const saveData = async () => {
    let preceed = true;

    if (!vehiclePlateNumber) {
      setError("Please add vehicle Plate Number");
      preceed = false;
    }
    if (preceed) {
      setIsLoading(true);
      try {
        const input = {
          capacity: vehicleCapacity,
          VehiclePlateNumber: vehiclePlateNumber,
          VehicleEnglishName: vehicleEnglishName,
          VehicleArabicName: vehicleArabicName,
          RegistrationNumber: registrationNumber,
          VehicleModelEnglish: makeModelEnglish,
          VehicleModelArabic: makeModelArabic,
          VehicleColorEnglish: colorWithEnglish,
          VehicleColorArabic: colorWithArabic,
          ChassisNumber: chassisNumber,
          EngineNumber: engineNumber,
          FuelType: fuelType,
          AuxilaryMeter: secAuxMeter,
          VehicleType: vehicleType,
          VehicleGroup: vehicleGroup,
          TrackUsageAs: trackUsageAs,
          YearOfManufacture: yearOfManufacture,
          FuelMeasurementIn: fuelMeasurementIn,
        };

        await axios.put("/api/Vehicles/" + data.id, input, {
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
        saveFcn={disabled ? saveFcn : saveData}
        cancelFcn={cancelFcn}
        withCancel={withCancel}
        isLoading={isLoading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Registration Number</label>
            <input
              disabled
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Vehicle Plate Number (*)</label>
            <input
              disabled
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={vehiclePlateNumber}
              onChange={(e) => setVehiclePlateNumber(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Vehicle Capacity</label>
            <input
              disabled={disabled}
              type="number"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Vehicle Arabic Name</label>
            <input
              disabled={disabled}
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={vehicleArabicName}
              onChange={(e) => setVehicleArabicName(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Vehicle English Name</label>
            <input
              disabled={disabled}
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={vehicleEnglishName}
              onChange={(e) => setVehicleEnglishName(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Engine Number</label>
            <input
              disabled={disabled}
              type="number"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={engineNumber}
              onChange={(e) => setEngineNumber(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Make Model English</label>
            <input
              disabled={disabled}
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={makeModelEnglish}
              onChange={(e) => setMakeModelEnglish(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Make Model Arabic</label>
            <input
              disabled={disabled}
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={makeModelArabic}
              onChange={(e) => setMakeModelArabic(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Chassis Number</label>
            <input
              disabled={disabled}
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={chassisNumber}
              onChange={(e) => setChassisNumber(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Vehicle Type</label>
            <input
              disabled={disabled}
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={vehicleType}
              onChange={(e) => setVehiculeType(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Vehicle Group</label>
            <input
              disabled={disabled}
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={vehicleGroup}
              onChange={(e) => setVehicleGroup(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Track Usage As</label>
            <input
              disabled={disabled}
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={trackUsageAs}
              onChange={(e) => setTrackUsageAs(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Year Of Manufacture</label>
            <input
              disabled={disabled}
              type="date"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={yearOfManufacture}
              onChange={(e) => setYearOfManufacture(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Fuel Measurement In</label>
            <input
              disabled={disabled}
              type="string"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={fuelMeasurementIn}
              onChange={(e) => setFuelMeasurementIn(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Fuel Type</label>
            <select
              disabled={disabled}
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
            >
              <option value="">select option</option>
              {["Oil", "CNG"].map((elem) => (
                <option value={elem}>{elem}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Color With Arabic</label>
            <input
              disabled={disabled}
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={colorWithArabic}
              onChange={(e) => setColorWithArabic(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Color With English</label>
            <input
              disabled={disabled}
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={colorWithEnglish}
              onChange={(e) => setColorWithEnglish(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Secondary/Auxilary Meter</label>
            <input
              disabled={disabled}
              type="radio"
              value="YES"
              checked={secAuxMeter === "YES"}
              onChange={(e) => setSecAuxMeter(e.target.value)}
              className="mx-2"
            />
            <label>YES</label>
            <input
              disabled={disabled}
              type="radio"
              value="NO"
              checked={secAuxMeter === "NO"}
              onChange={(e) => setSecAuxMeter(e.target.value)}
              className="mx-2"
            />
            <label>NO</label>
          </div>
          <span className="font-semibold text-red-500">{error} </span>
        </div>
      </Modal>
    </>
  );
}
