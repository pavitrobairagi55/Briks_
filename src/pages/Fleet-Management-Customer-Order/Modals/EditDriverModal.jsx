import { useContext, useState } from "react";

import Modal from "../../../components/Modal";
import { convertExistingDate } from "../../../utils";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";

export default function EditDriverModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
  disabled,
  data,
}) {
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [driverName, setDriverName] = useState(data?.name);
  const [driverNumber, setDriverNumber] = useState(data?.number);
  const [driverLicense, setDriverLicense] = useState(data?.license);
  const [licensesIssueDate, setLicensesIssueDate] = useState(
    convertExistingDate(data?.licenseIssueDate)
  );
  const [licensesExpireDate, setLicensesExpireDate] = useState(
    convertExistingDate(data?.licenseExpireDate)
  );
  const [typeOfIqama, setTypeOfIqama] = useState(data?.iqamaType);
  const [numberOfIqama, setNumberOfIqama] = useState(data?.iqamaNumber);
  const [experationDate, setExperationDate] = useState(
    convertExistingDate(data?.iqamaExpirationDate)
  );
  const [active, setActive] = useState();
  const [error, setError] = useState();
  const [transporationCompany, setTransporationCompany] = useState(
    data?.transporationCompany
  );

  const saveData = async () => {
    let preceed = true;
    if (!driverName) {
      setError("Please Add driver Name");
      preceed = false;
    }
    if (!transporationCompany) {
      setError("Please Add Transporation Company");
      preceed = false;
    }
    if (preceed) {
      setIsLoading(true);
      try {
        const input = {
          number: driverNumber,
          transporationCompany: transporationCompany,

          driverLicense: driverLicense,
          licenseIssueDate: Array.isArray(licensesIssueDate)
            ? licensesIssueDate[0]
            : licensesIssueDate,
          licenseExpireDate: Array.isArray(licensesExpireDate)
            ? licensesExpireDate[0]
            : licensesExpireDate,
          iqamaType: typeOfIqama,
          iqamaNumber: numberOfIqama,
          iqamaExpirationDate: Array.isArray(experationDate)
            ? experationDate[0]
            : experationDate,
        };

        await axios.put("/api/CustomerDrivers/" + data.id, input, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        });

        saveFcn();
      } catch (error) {
        setIsLoading(false);
        if (error.request.response) {
          setError(JSON.parse(error.request.response).title);
        } else setError("Error ");
      }
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
            <label className="block mb-2">Driver Name(*)</label>
            <input
              disabled={true}
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Transporation Company (*)</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={transporationCompany}
              onChange={(e) => setTransporationCompany(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Driver Number</label>
            <input
              disabled={disabled}
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={driverNumber}
              onChange={(e) => setDriverNumber(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Driver License</label>
            <input
              disabled={disabled}
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={driverLicense}
              onChange={(e) => setDriverLicense(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Licenses Issue Date</label>
            <input
              disabled={disabled}
              type="Date"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={licensesIssueDate}
              onChange={(e) => setLicensesIssueDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Licenses Expire Date</label>
            <input
              disabled={disabled}
              type="date"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={licensesExpireDate}
              onChange={(e) => setLicensesExpireDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2">Type Of Iqama</label>
            <select
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              disabled
              value={typeOfIqama}
              onChange={(e) => setTypeOfIqama(e.target.value)}
            >
              {["Saudi", "Iqma"].map((elem) => (
                <option value={elem}>{elem}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Number Of Iqama</label>
            <input
              disabled={disabled}
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={numberOfIqama}
              onChange={(e) => setNumberOfIqama(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Experation Date</label>
            <input
              disabled={disabled}
              type="date"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={experationDate}
              onChange={(e) => setExperationDate(e.target.value)}
            />
          </div>
          {/* <div>
            <input
              disabled={disabled}
              type="checkbox"
              value={active}
              checked={active === "YES"}
              onChange={(e) => setActive(e.target.value)}
              className="mx-2"
            />
            <label>Active</label>
          </div>
          <div></div> */}
          <span className="font-semibold text-red-500">{error} </span>
        </div>
      </Modal>
    </>
  );
}
