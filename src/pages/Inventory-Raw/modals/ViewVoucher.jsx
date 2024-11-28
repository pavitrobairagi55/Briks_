import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Modal from "../../../components/Modal";
import { IconButton } from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import ZoneCard from "../components/ZoneCard";

export default function ViewVoucher(props) {
  const [zones, setZones] = useState([]);

  const handleZoneChange = (e, id) => {
    const newZones = zones.map((elem) => {
      if (elem.id === id) {
        return { ...elem, [e.target.name]: e.target.value };
      }
      return elem;
    });
    setZones(newZones);
  };

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
              Type
            </label>
            <select
              id="location"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
            >
              {[].map((elem, i) => (
                <option key={i} value={elem.id}>
                  {elem.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="Location" className="block mb-2">
              Date
            </label>
            <select
              id="location"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
            >
              {[].map((elem, i) => (
                <option key={i} value={elem.id}>
                  {elem.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="Location" className="block mb-2">
              Note
            </label>
            <input type="text area" />{" "}
          </div>
          <div>
            <label htmlFor="Location" className="block mb-2">
              Units
            </label>
            <select
              id="location"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
            >
              {[].map((elem, i) => (
                <option key={i} value={elem.id}>
                  {elem.name}
                </option>
              ))}
            </select>
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
