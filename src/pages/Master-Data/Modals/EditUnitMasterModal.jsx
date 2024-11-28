import { useContext, useEffect, useState } from "react";

import Modal from "../../../components/Modal";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";

export default function EditUnitMasterModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
  data,
  editable,
}) {
  const [name, setName] = useState(data.name);
  const [error, setError] = useState();
  const [isLoading, setIsloading] = useState();

  const [unitCode, setUnitCode] = useState(data.code);
  const [quantityPerUnit, setQuantityPerUnit] = useState();
  const [description, setDescription] = useState(data.description);

  const auth = useContext(AuthContext);

  const saveData = async () => {
    setIsloading(true);
    try {
      if (!description || !unitCode) {
        setError("Please fullfill all the requested infomation");
        setIsloading(false);

        return;
      }
      const input = {
        description: description,
        code: unitCode,
      };
      await axios.put(`/api/units/${data.id}`, input, {
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
        saveFcn={editable ? saveData : closeModal}
        cancelFcn={cancelFcn}
        withCancel={withCancel}
        isLoading={isLoading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Name</label>
            <input
              disabled
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
              disabled={!editable}
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={unitCode}
              onChange={(e) => {
                setUnitCode(e.target.value);
              }}
            />
          </div>
          {/*  <div>
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
              disabled={!editable}
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
