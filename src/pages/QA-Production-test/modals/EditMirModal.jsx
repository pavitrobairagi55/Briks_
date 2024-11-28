import { useContext, useState } from "react";
import Modal from "../../../components/Modal";
import useFetch from "../../../shared/useFetch";
import UseFetchData from "../../../shared/useFetchData";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
import { formatDate, uploadFile } from "../../../utils";

export default function EditMirModal({
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
  const [mir, setMir] = useState(data.mir);
  const [aljubailahSoileStorage, setAljubailahSoileStorage] = useState(
    data.jubailahZone?.id
  );
  const { data: aljubailahSoileStorageList } = useFetch("Zones/soil-al-jubila");
  const { data: bulkList } = useFetch("MirRequests/qasab-bulk");
  const [bulk, setBulk] = useState(data.alQasabBulk?.id);
  const getFilteredURL = () => {
    let urlapi = `api/MirRequests/bulk-area/${bulk}`;
    return urlapi;
  };
  const { data: qasabBulkList } = UseFetchData(getFilteredURL(), [bulk]);
  const [bulkId, setBulkId] = useState(data.kasbZone?.id);
  const [serialNumber, setSerialNumber] = useState(data.serialNumber);
  const [quantity, setQuantity] = useState(data.quantity);
  const [report, setReport] = useState();
  const [reportId, setReportId] = useState(data.uploadFile?.id);
  const [clayContent, setClayContent] = useState(data.clayContent);
  const [date, setDate] = useState(data.createdDate.split("T", 1));

  const [error, setError] = useState();

  const handleChangeFile = (e) => {
    setReportId(null);
    setReport(e.target.files[0]);
  };
  const saveData = async () => {
    try {
      if (!reportId) {
        const files = await uploadFile(report, auth);
        setReportId(files);
      }

      const input = {
        MIR: mir,
        SerialNumber: serialNumber,
        Quantity: +quantity,
        ClayContent: clayContent,
        JubailahZoneId: +aljubailahSoileStorage,
        AlQasabBulkId: +bulk,
        KasbZoneId: +bulkId,
        CreatedDate: Array.isArray(date) ? date[0] : date,
        UploadFileId: reportId,
      };

      await axios.put(`api/MirRequests/${data.id}`, input, {
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
            <h4>MIR</h4>
            <input
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              type="text"
              value={mir}
              onChange={(e) => setMir(e.target.value)}
            />
          </div>
          <div className="w-1/2 sm:w-full">
            <h4>Aljubailah Soil Storage</h4>
            <select
              className="w-full px-3 py-2 border rounded-lg text-gray-700 "
              value={aljubailahSoileStorage}
              onChange={(e) => setAljubailahSoileStorage(e.target.value)}
            >
              <option value="">select a storage</option>
              {aljubailahSoileStorageList?.map((elem, index) => (
                <option key={index} value={elem.id}>
                  {elem.name}
                </option>
              ))}
            </select>
          </div>
        </div>{" "}
        <div className="w-full flex justify-between gap-7 mb-7  ">
          <div className="w-1/2 sm:w-full">
            <h4>Bulk</h4>
            <select
              className="w-full px-3 py-2 border rounded-lg text-gray-700 "
              value={bulk}
              onChange={(e) => setBulk(e.target.value)}
            >
              <option value="">Select option</option>
              {bulkList?.map((elem, index) => (
                <option key={index} value={elem.id}>
                  {elem.value}
                </option>
              ))}
            </select>
          </div>
          {bulk && (
            <div className="w-full flex justify-between gap-7 mb-7  ">
              <div className="w-1/2 sm:w-full">
                <h4>Grid</h4>
                <select
                  className="w-full px-3 py-2 border rounded-lg text-gray-700 "
                  value={bulkId}
                  onChange={(e) => setBulkId(e.target.value)}
                >
                  <option value="">Select option</option>
                  {qasabBulkList?.map((elem, index) => (
                    <option key={index} value={elem.id}>
                      {elem.value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {!bulk && <div className="w-1/2 sm:w-full"> </div>}
        </div>
        <div className="w-full flex justify-between gap-7 mb-7  ">
          <div className="w-1/2 sm:w-full">
            <h4>Serial Number</h4>
            <input
              disabled
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              type="text"
              value={serialNumber}
            />
          </div>
          <div className="w-1/2 sm:w-full"> </div>
        </div>
        <div className="w-full flex justify-between gap-7 mb-7  ">
          <div className="w-1/2 sm:w-full">
            <h4>QTY</h4>
            <input
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="w-1/2 sm:w-full">
            <h4>Soil Test Report</h4>
            <input
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              type="file"
              onChange={(e) => handleChangeFile(e)}
            />
          </div>
        </div>
        <div className="w-full flex justify-between gap-7 mb-7">
          <div className="w-1/2 sm:w-full">
            <h4>Clay Content %</h4>
            <input
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              type="text"
              value={clayContent}
              onChange={(e) => setClayContent(e.target.value)}
            />
          </div>
          <div className="w-1/2 sm:w-full">
            <h4>Date</h4>
            <input
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
        <span className="font-semibold text-red-500">{error} </span>
      </div>
    </Modal>
  );
}
