import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Modal from "../../../components/Modal";
import { IconButton } from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import ZoneCard from "../components/ZoneCard";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";

export default function EditWareHouseModal({
  withCancel,
  cancelFcn,
  closeModal,
  type,
  title,
  locationList,
  materialTypesList,
  saveFcn,
  data,
}) {
  const auth = useContext(AuthContext);
  const [element, setElement] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [wareHouseName, setWareHouseName] = useState();
  const [location, setLocation] = useState();
  const [materialType, setMaterialType] = useState();
  const [storeKeeper, setStoreKeeper] = useState();
  const [address, setAddress] = useState();
  const [error, setError] = useState();

  const [isActive, setIsActive] = useState();

  const [zones, setZones] = useState([]);
  const [oldZones, setOldZones] = useState([]);
  const [basedZones, setBasedZones] = useState([]);

  const [zonesToDelete, setZonesToDelete] = useState([]);
  const [zonesToAdd, setZonesToAdd] = useState([]);
  const [zonesToUpdate, setZonesToUpdate] = useState([]);

  const handleZonesDelete = (id) => {
    const zone = zones.find((elem) => elem.id === id);
    if (zone) {
      setZonesToDelete([...zonesToDelete, zone.id]);
    }
    const newZones = zones.filter((elem) => elem.id !== id);
    setZones(newZones);
  };
  const handleZoneChange = (e, id) => {
    const existingZone = oldZones.find((zone) => zone.id === id);

    const newZones = zones.map((elem) => {
      if (elem.id === id) {
        return { ...elem, [e.target.name]: e.target.value };
      }
      return elem;
    });

    if (
      existingZone &&
      !zonesToAdd.includes(existingZone.id) &&
      !zonesToUpdate.includes(existingZone.id)
    ) {
      zonesToUpdate.push(id);
    } else if (!zonesToAdd.includes(id) && !zonesToUpdate.includes(id)) {
      zonesToAdd.push(id);
    }

    setZones(newZones);
    setOldZones(newZones);
  };

  const saveData = async () => {
    let preceed = true;

    if (!location || !materialType || !storeKeeper) {
      setError("Please fullfill all the requested infomation");
      preceed = false;
      return;
    }

    if (preceed) {
      setIsLoading(true);
      try {
        const toUpdate = [];
        const basedids = basedZones.map((elem) => elem.id.toString());
        for (const elem of zonesToUpdate) {
          if (basedids.includes(elem.toString())) {
            toUpdate.push(elem.toString());
          } else if (!zonesToAdd.includes(elem.toString())) {
            zonesToAdd.push(elem.toString());
          }
        }
        const newZones = zonesToAdd
          .map((el) =>
            zones.find((elem) => elem.id.toString() === el.toString())
          )
          .filter((el) => el !== undefined);

        const updatedZones = toUpdate
          .map((el) => {
            const found = zones.find(
              (elem) => elem.id.toString() === el.toString()
            );
            if (found) {
              return {
                id: found.id,
                description: found.description,
                capacity: found.capacity,
              };
            }
          })
          .filter((el) => el !== undefined);

        const input = {
          address: address,
          storeKeeperName: storeKeeper,
          locationId: location,
          masterItemTypeId: materialType,
          zonesToAdd: newZones,
          zonesToUpdate: updatedZones,
          zonesToDelete: zonesToDelete,
        };

        await axios.put(`api/warehouses/${data.id}`, input, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        });

        saveFcn();
      } catch (error) {
        setIsLoading(false);

        setError(JSON.parse(error?.request?.response)?.title);
      }
    }
  };

  const fetchData = async () => {
    const response = await axios.get(`api/warehouses/${data.id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    });
    setElement(response.data);
    setWareHouseName(response.data?.name);
    setLocation(response.data?.locationId);
    setMaterialType(response.data?.masterItemTypeId);
    setStoreKeeper(response.data?.storeKeeperName);
    setAddress(response.data?.address);
    setZones(response.data?.zones);
    setOldZones(response.data?.zones);
    setBasedZones(response.data?.zones);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Modal
        showSave={true}
        withCancel={withCancel}
        cancelFcn={cancelFcn}
        closeModal={closeModal}
        type={type}
        title={title}
        saveFcn={saveData}
        isLoading={isLoading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="Location" className="block mb-2">
              Location
            </label>
            <select
              id="location"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {locationList.map((elem, i) => (
                <option key={i} value={elem.id}>
                  {elem.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="warehouseName" className="block mb-2">
              Warehouse Name
            </label>
            <input
              disabled
              type="text"
              value={wareHouseName}
              onChange={(e) => setWareHouseName(e.target.value)}
              id="warehouseName"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
            />
          </div>
          <div>
            <label htmlFor="matrialType" className="block mb-2">
              Material Type{" "}
            </label>
            <select
              id="matrialType"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={materialType}
              onChange={(e) => setMaterialType(e.target.value)}
              defaultValue="Select Warehouse Type"
            >
              {materialTypesList.map((elem, i) => (
                <option key={i} value={elem.id}>
                  {elem.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="storeKeeper" className="block mb-2">
              Store keeper/Supervioor
            </label>
            <input
              id="storeKeeper"
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={storeKeeper}
              onChange={(e) => setStoreKeeper(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="adress" className="block mb-2">
              Address{" "}
            </label>
            <input
              id="adress"
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
        <div>
          {/*  <div className="flex gap-2 items-center mb-5">
              <label htmlFor="checkbox">Active</label>
              <input type="checkbox" id="checkbox" />
            </div> */}
          <div className="flex gap-2 items-center	">
            <span>Add Zones</span>
            <IconButton
              sx={{ color: "bleu" }}
              size="large"
              onClick={() =>
                setZones((prev) => [
                  ...prev,
                  {
                    id: uuidv4(),
                    name: "",
                    description: "",
                    capacity: "",
                  },
                ])
              }
              aria-label="Delete Row"
            >
              <AddCircle />
            </IconButton>
          </div>
          {zones?.length === 0 && (
            <p className="my-3 text-red-700	"> You must at least add on Zone</p>
          )}
          <ZoneCard
            zones={zones}
            basedZones={basedZones}
            onChange={(e, id) => handleZoneChange(e, id)}
            onDelete={(id) => handleZonesDelete(id)}
            editable={true}
          />
        </div>
        {error && <span className="font-semibold text-red-500">{error} </span>}
      </Modal>
    </>
  );
}