import { useContext, useState } from "react";
import Modal from "../../../components/Modal";
import useFetch from "../../../shared/useFetch";
import UseFetchData from "../../../shared/useFetchData";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
import { uploadFile } from "../../../utils";

export default function AddMirAthelModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
}) {
  const auth = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState();
  const [serialNumber, setSerialNumber] = useState();
  const [MIRNumber, setMIRNumber] = useState();
  const [sourceLocation, setSourceLocation] = useState();
  const [batchNumber, setBatchNumber] = useState();
  const [approvedQuantity, setApprovedQuantity] = useState();
  const [dateSubmitted, setDateSubmitted] = useState();
  const [MirCopy, setMirCopy] = useState();

  const [error, setError] = useState();

  const saveData = async () => {
    if (
      !MIRNumber ||
      !serialNumber ||
      !sourceLocation ||
      !batchNumber ||
      !approvedQuantity ||
      !dateSubmitted ||
      !MirCopy
    ) {
      setError("Please fullfill all the requested infomation");
      return;
    }
    setIsLoading(true);
    try {
      const MirCopyId = await uploadFile(MirCopy, auth);

      const input = {
        MIRNumber,
        SerialNumber: serialNumber,
        SourceLocation: sourceLocation,
        BatchNumber: batchNumber,
        ApprovedQuantity: approvedQuantity,
        DateSubmitted: dateSubmitted,
        MirCopyId: +MirCopyId,
      };

      await axios.post("api/AthelWoodClassificationMIR", input, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      saveFcn();
    } catch (error) {
      console.log("🚀 ~ saveData ~ error:", error);
      setIsLoading(false);

      setError(error?.response?.data);
    }
  };

  return (
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
      <div className="  w-full gap-7">
        <div className="w-full flex justify-between gap-7 mb-7 flex-row ">
          <div className="w-1/2 sm:w-full">
            <h4>Serial Number</h4>
            <input
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              type="text"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
            />
          </div>
          <div className="w-1/2 sm:w-full">
            <h4>Mir Number</h4>
            <input
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              type="text"
              value={MIRNumber}
              onChange={(e) => setMIRNumber(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full flex justify-between gap-7 mb-7  ">
          <div className="w-1/2 sm:w-full">
            <h4>Date Submitted</h4>
            <input
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              type="date"
              value={dateSubmitted}
              onChange={(e) => setDateSubmitted(e.target.value)}
            />
          </div>
          <div className="w-1/2 sm:w-full">
            <h4>Source Location</h4>
            <input
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              type="text"
              value={sourceLocation}
              onChange={(e) => setSourceLocation(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full flex justify-between gap-7 mb-7">
          <div className="w-1/2 sm:w-full">
            <h4>Batch Number</h4>
            <input
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              type="number"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
            />
          </div>
          <div className="w-1/2 sm:w-full">
            <h4>Qty</h4>
            <input
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              type="number"
              value={approvedQuantity}
              onChange={(e) => setApprovedQuantity(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full flex justify-between gap-7 mb-7  ">
          <div className="w-1/2 sm:w-full">
            <h4>Mir File</h4>
            <input
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              type="file"
              onChange={(e) => setMirCopy(e.target.files[0])}
            />
          </div>
          <div className="w-1/2 sm:w-full"></div>
        </div>
        <span className="font-semibold text-red-500">{error} </span>
      </div>
    </Modal>
  );
}