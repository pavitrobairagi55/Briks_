import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Modal from "../../../components/Modal";
import { IconButton } from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import ZoneCard from "../components/ZoneCard";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";

export default function ViewWareHouseModal(props) {
  const locationList = props.locationList;
  const materialTypesList = props.materialTypesList;
  const auth = useContext(AuthContext);
  const [data, setData] = useState();

  const [wareHouseName, setWareHouseName] = useState();
  const [location, setLocation] = useState();
  const [materialType, setMaterialType] = useState();

  const [storeKeeper, setStoreKeeper] = useState();
  const [address, setAddress] = useState();
  const [isActive, setIsActive] = useState();

  const [zones, setZones] = useState([]);

  const handleZonesDelete = (id) => {
    const newZones = zones.filter((elem) => elem.id !== id);
    setZones(newZones);
  };

  const fetchData = async () => {
    const response = await axios.get(`api/warehouses/${props.data.id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    });
    setData(response.data);
    setWareHouseName(response.data?.name);
    setLocation(response.data?.locationId);
    setMaterialType(response.data?.masterItemTypeId);
    setStoreKeeper(response.data?.storeKeeperName);
    setAddress(response.data?.address);
    setZones(response.data?.zones);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Modal showSave={true} {...props}>
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
              disabled
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
              type="text"
              value={wareHouseName}
              onChange={(e) => setWareHouseName(e.target.value)}
              id="warehouseName"
              disabled
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
            />
          </div>
          <div>
            <label htmlFor="matrialType" className="block mb-2">
              Material Type{" "}
            </label>
            <select
              disabled
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
              disabled
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
              disabled
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

          {zones?.length === 0 && (
            <p className="my-3 text-red-700	"> You must at least add on Zone</p>
          )}
          <ZoneCard
            zones={zones}
            basedZones={zones}
            onChange={(e, id) => handleZoneChange(e, id)}
            onDelete={(id) => handleZonesDelete(id)}
            editable={false}
          />
        </div>
      </Modal>
    </>
  );
}
