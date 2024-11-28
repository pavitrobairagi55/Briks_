import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";

import Modal from "../../../components/Modal";

export default function EditCollectionModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
  data,
}) {
  const [date, setDate] = useState(data.collectionDate);
  const [bricksByPiece, setBricksByPiece] = useState(data.bricksQt);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useContext(AuthContext);
  const [error, setError] = useState();

  const saveData = async () => {
    if (!date || !bricksByPiece) {
      setError("Please fullfill all the requested infomation");
      return;
    }

    setIsLoading(true);

    try {
      const input = {
        moldingRequestId: data.moldingRequest.id,
        collectionDate: Array.isArray(date) ? date[0] : date,
        BricksQt: bricksByPiece,
      };

      await axios.put(`api/Collection/${data.id}`, input, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setIsLoading(false);
      saveFcn();
    } catch (error) {
      setIsLoading(false);
      if (error.request.response) {
        setError(JSON.parse(error.request.response).title);
      } else setError("Error");
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Bricks By Piece</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={bricksByPiece}
              onChange={(e) => setBricksByPiece(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">date Collection</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
        <span className="font-semibold text-red-500">{error} </span>
      </Modal>
    </>
  );
}
