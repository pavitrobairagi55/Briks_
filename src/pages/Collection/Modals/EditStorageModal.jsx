import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";

import Modal from "../../../components/Modal";
import { formatDate } from "../../../utils";
import useFetch from "../../../shared/useFetch";

export default function EditStorageModal({
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
  const [comprehensiveStrenth, sestComprehensiveStrenth] = useState(
    data.comprehensiveStrenth
  );
  const [flexuralStrenth, setFlexuralStrenth] = useState(data.flexuralStrenth);
  const [brickByPallete, setBrickByPallete] = useState(data.brickByPallete);
  const [storageLocationId, setStorageLocationId] = useState(
    +data.storageLocation.id
  );
  const [testReport, setTestReport] = useState();
  const [testReportId, setTestReportId] = useState(data?.testReportFile?.id);
  const [locationFile, setLocationFile] = useState();
  const [locationFileId, setLocationFileId] = useState(data?.locationFile?.id);

  const saveData = async () => {
    if (
      !comprehensiveStrenth ||
      !flexuralStrenth ||
      !brickByPallete ||
      !storageLocationId
    ) {
      setError("Please fullfill all the requested infomation");
      return;
    }
    setIsLoading(true);
    try {
      if (!testReportId) {
        const id = await uploadFile(testReport, auth);
        setTestReportId(id);
      }
      if (!locationFileId) {
        const id = await uploadFile(locationFile, auth);
        setLocationFileId(id);
      }

      const input = {
        collectionRequestId: data?.collectionRequest?.id,
        comprehensiveStrenth: +comprehensiveStrenth,
        flexuralStrenth: +flexuralStrenth,
        brickByPallete: +brickByPallete,
        storageLocationId: +storageLocationId,
        TestReportFileId: +testReportId,
        LocationFileId: +locationFileId,
      };

      await axios.put(`api/Storage/${data.id}`, input, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      saveFcn();
    } catch (error) {
      setIsLoading(false);

      setError(error.response?.data);
    }
  };

  const handleChangeTestReportFile = (e) => {
    setTestReportId(null);
    setTestReport(e.target.files[0]);
  };
  const handleChangeLocationFileFile = (e) => {
    setLocationFileId(null);
    setLocationFile(e.target.files[0]);
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
              onChange={(e) => handleChangeLocationFileFile(e)}
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
              onChange={(e) => handleChangeTestReportFile(e)}
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
      </Modal>
    </>
  );
}
