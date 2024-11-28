import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Modal from "../../../components/Modal";
import useFetch from "../../../shared/useFetch";
import { IconButton } from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import ZoneCard from "../components/ZoneCard";

export default function AddWareHouseModal(props) {
  const [productCategoriesList, setProductCategoriesList] = useState([]);
  const [productCategorie, setProductCategorie] = useState();

  const [zones, setZones] = useState([]);

  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState();

  const handleZonesDelete = (id) => {
    const newZones = zones.filter((elem) => elem.id !== id);
    setZones(newZones);
  };

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
              value={productCategorie}
              onChange={(e) => setProductCategorie(e.target.value)}
            >
              {productCategoriesList.map((elem, i) => (
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
              name=""
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
              value={productCategorie}
              onChange={(e) => setProductCategorie(e.target.value)}
              defaultValue="Select Warehouse Type"
            >
              {productCategoriesList.map((elem, i) => (
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
              value={expectedDeliveryDate}
              onChange={(e) => setExpectedDeliveryDate(e.target.value)}
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
              value={expectedDeliveryDate}
              onChange={(e) => setExpectedDeliveryDate(e.target.value)}
            />
          </div>
        </div>
        <div>
          <div className="flex gap-2 items-center mb-5">
            <label htmlFor="checkbox">Active</label>
            <input type="checkbox" id="checkbox" />
          </div>
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
                    unitName: "",
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
            onChange={(e, id) => handleZoneChange(e, id)}
            onDelete={(id) => handleZonesDelete(id)}
          />
        </div>
      </Modal>
    </>
  );
}
