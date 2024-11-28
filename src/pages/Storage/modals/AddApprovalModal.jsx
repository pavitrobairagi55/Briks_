import { useContext, useState } from "react";
import Modal from "../../../components/Modal";
import useFetch from "../../../shared/useFetch";
import UseFetchData from "../../../shared/useFetchData";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
import EnhancedTable from "../../../components/tabel/Table";
import { formatDate, uploadFile } from "../../../utils";

export default function AddApprovalModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
  data,
}) {
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState();
  const [wire, setWire] = useState();
  const [file, setFile] = useState();

  const [error, setError] = useState();

  const saveData = async () => {
    if (!wire || !file) {
      setError("Please fullfill all the requested infomation");
      return;
    }
    saveFcn();
    setIsLoading(true);
    try {
      const WireDocumentId = await uploadFile(file, auth);

      const input = {
        storageRequestId: data.id,
        approvalWire: wire,
        WireDocumentId: WireDocumentId,
      };

      await axios.post("api/Approval", input, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      saveFcn();
    } catch (error) {
      console.log("🚀 ~ saveData ~ error:", error);
      setIsLoading(false);

      setError(error.response?.data);
    }
  };
  const headCells = [
    {
      id: "CollectionRequest",
      numeric: false,
      disablePadding: true,
      label: "Collection  Request",
    },
    {
      id: "CollectionDate",
      numeric: true,
      disablePadding: false,
      label: "Collection Date",
    },
    {
      id: "Storage",
      numeric: true,
      disablePadding: false,
      label: "Storage",
    },
    {
      id: "BrickByPallete",
      numeric: true,
      disablePadding: false,
      label: "BrickByPallete",
    },
  ];
  const row = [data]?.map((elem) => {
    return {
      id: elem.id,
      CollectionRequest: elem.collectionRequest.id,
      CollectionDate: formatDate(elem.collectionRequest.date),
      Storage: elem.storageLocation.name,
      BrickByPallete: elem.brickByPallete,
    };
  });
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
            <h4>Wire#</h4>
            <input
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              type="number"
              value={wire}
              onChange={(e) => setWire(e.target.value)}
            />
          </div>
          <div className="w-1/2 sm:w-full">
            <h4>Wir Document</h4>
            <input
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
        </div>{" "}
        <span className="font-semibold text-red-500">{error} </span>
      </div>
      <EnhancedTable rows={row || []} headCells={headCells} />
    </Modal>
  );
}
