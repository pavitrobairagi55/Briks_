import { useContext, useEffect, useState } from "react";

import Modal from "../../../components/Modal";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";

export default function AddUnitMasterModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
}) {
  const [name, setName] = useState();
  const [error, setError] = useState();
  const [unitCode, setUnitCode] = useState();
  const [quantityPerUnit, setQuantityPerUnit] = useState();
  const [description, setDescription] = useState();
  const [isLoading, setIsloading] = useState();

  const auth = useContext(AuthContext);

  const saveData = async () => {
    setIsloading(true);
    try {
      if (!name || !description || !unitCode) {
        setError("Please fullfill all the requested infomation");
        setIsloading(false);

        return;
      }
      const input = {
        name: name,
        description: description,
        code: unitCode,
      };
      await axios.post(`/api/units`, input, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      saveFcn();
      setIsloading(false);
    } catch (error) {
      setIsloading(false);

      setError(JSON.parse(error.request.responseText).title);
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
            <label className="block mb-2">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block mb-2">Unit Code</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={unitCode}
              onChange={(e) => {
                setUnitCode(e.target.value);
              }}
            />
          </div>
          {/* <div>
            <label className="block mb-2">Quantity Per Unit</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={quantityPerUnit}
              onChange={(e) => {
                setQuantityPerUnit(e.target.value);
              }}
            />
          </div>
          <div></div> */}
          <div>
            <label className="block mb-2">Description</label>
            <textarea
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>

          <span className="font-semibold text-red-500">{error} </span>
        </div>
      </Modal>
    </>
  );
}
