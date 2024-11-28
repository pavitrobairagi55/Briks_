import { useContext, useEffect, useState } from "react";
import HeaderFilter from "../../../components/filters/HeaderFilter";
import EnhancedTable from "../../../components/tabel/Table";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";

import Modal from "../../../components/Modal";

export default function AddModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
}) {
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const [driverName, setDriverName] = useState();
  const [driverNumber, setDriverNumber] = useState();
  const [driverLicense, setDriverLicense] = useState("");
  const [licensesIssueDate, setLicensesIssueDate] = useState();
  const [licensesExpireDate, setLicensesExpireDate] = useState();
  const [typeOfIqama, setTypeOfIqama] = useState("");
  const [numberOfIqama, setNumberOfIqama] = useState("");
  const [experationDate, setExperationDate] = useState();
  const [transporationCompany, setTransporationCompany] = useState();
  const [active, setActive] = useState();
  const [error, setError] = useState();

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
          DriverName: driverName,
          DriverNumber: driverNumber,
          transporationCompany: transporationCompany,
          DriverLicense: driverLicense,
          LicenseIssueDate: Array.isArray(licensesIssueDate)
            ? licensesIssueDate[0]
            : licensesIssueDate,
          LicenseExpireDate: Array.isArray(licensesExpireDate)
            ? licensesExpireDate[0]
            : licensesExpireDate,
          IqamaType: typeOfIqama,
          IqamaNumber: numberOfIqama,
          IqamaExpirationDate: Array.isArray(experationDate)
            ? experationDate[0]
            : experationDate,
          ISActive: true,
        };

        await axios.post("/api/Drivers", input, {
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
        } else setError("Error");
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
            <label className="block mb-2">Driver Name (*)</label>
            <input
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
            <label className="block mb-2">Phone Number</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={driverNumber}
              onChange={(e) => setDriverNumber(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Driver License</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={driverLicense}
              onChange={(e) => setDriverLicense(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Licenses Issue Date</label>
            <input
              type="Date"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={licensesIssueDate}
              onChange={(e) => setLicensesIssueDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Licenses Expire Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={licensesExpireDate}
              onChange={(e) => setLicensesExpireDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2">Type Of ID</label>
            <select
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={typeOfIqama}
              onChange={(e) => setTypeOfIqama(e.target.value)}
            >
              <option value={null}>Select Option</option>

              {["Saudi", "Iqma"].map((elem) => (
                <option value={elem}>{elem}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">ID Number</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={numberOfIqama}
              onChange={(e) => setNumberOfIqama(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Experation Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={experationDate}
              onChange={(e) => setExperationDate(e.target.value)}
            />
          </div>
          {/*  <div>
            <input
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
