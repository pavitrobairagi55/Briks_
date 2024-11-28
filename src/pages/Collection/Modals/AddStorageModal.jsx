import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";

import Modal from "../../../components/Modal";
import { formatDate, uploadFile } from "../../../utils";
import useFetch from "../../../shared/useFetch";

export default function AddStorageModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
  data,
}) {
  const auth = useContext(AuthContext);
  const { data: aljubailahSoileStorageList } = useFetch(
    "MirRequests/jubila-storage"
  );
  const [isLoading, setIsLoading] = useState();

  const [error, setError] = useState();
  const [comprehensiveStrenth, sestComprehensiveStrenth] = useState();
  const [flexuralStrenth, setFlexuralStrenth] = useState();
  const [brickByPallete, setBrickByPallete] = useState();
  const [storageLocationId, setStorageLocationId] = useState();
  const [testReport, setTestReport] = useState();
  const [locationFile, setLocationFile] = useState();

  const headCells = [
    {
      id: "CollectionRequest",
      numeric: false,
      disablePadding: true,
      label: "Collection Request",
    },
    {
      id: "MixingReuest",
      numeric: true,
      disablePadding: false,
      label: "Mixing Reuest",
    },
    {
      id: "CollectionDate",
      numeric: true,
      disablePadding: false,
      label: "Collection Date",
    },
    {
      id: "bricksQt",
      numeric: true,
      disablePadding: false,
      label: "bricksQt",
    },
    {
      id: "MoldingDate",
      numeric: true,
      disablePadding: false,
      label: "Molding Date",
    },
  ];
  const rows = [data]?.map((elem) => {
    return {
      id: elem.id,
      CollectionRequest: elem.id,
      CollectionDate: formatDate(elem.collectionDate),
      MixingReuest: elem.mixingRequest.mixingNumberRequest,
      bricksQt: elem.bricksQt,
      MoldingDate: formatDate(elem.moldingRequest.moldingDate),
    };
  });

  const saveData = async () => {
    if (
      !comprehensiveStrenth ||
      !flexuralStrenth ||
      !brickByPallete ||
      !storageLocationId ||
      !testReport ||
      !locationFile
    ) {
      setError("Please fullfill all the requested infomation");
      return;
    }
    setIsLoading(true);
    try {
      const testReportId = await uploadFile(testReport, auth);
      const locationFileId = await uploadFile(locationFile, auth);

      const input = {
        collectionRequestId: data.id,
        comprehensiveStrenth: +comprehensiveStrenth,
        flexuralStrenth: +flexuralStrenth,
        brickByPallete: +brickByPallete,
        storageLocationId: +storageLocationId,
        TestReportFileId: +testReportId,
        LocationFileId: +locationFileId,
      };

      await axios.post("api/Storage", input, {
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
            <label className="block mb-2">Compressive Strength</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={comprehensiveStrenth}
              onChange={(e) => sestComprehensiveStrenth(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Attached Test Report</label>
            <input
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              type="file"
              onChange={(e) => setTestReport(e.target.files[0])}
            />
          </div>

          <div>
            <label className="block mb-2">Flexural Strength</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={flexuralStrenth}
              onChange={(e) => setFlexuralStrenth(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Location File</label>
            <input
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              type="file"
              onChange={(e) => setLocationFile(e.target.files[0])}
            />
          </div>
          <div>
            <label className="block mb-2">Bricks By Pallet</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={brickByPallete}
              onChange={(e) => setBrickByPallete(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2">Storage Location</label>
            <select
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={storageLocationId}
              onChange={(e) => setStorageLocationId(e.target.value)}
            >
              <option value="">Select Storage</option>
              {aljubailahSoileStorageList?.map((elem) => (
                <option value={elem.id}>{elem.value}</option>
              ))}
            </select>
          </div>
        </div>
        <span className="font-semibold text-red-500">{error} </span>

        <EnhancedTable rows={rows || []} headCells={headCells} />
      </Modal>
    </>
  );
}
