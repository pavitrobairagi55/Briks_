import { useContext, useState } from "react";

import Modal from "../../../components/Modal";
import EnhancedTable from "../../../components/tabel/Table";
import useFetch from "../../../shared/useFetch";
import axios from "../../../api/axios";
import { AuthContext } from "../../../shared/authContext";

export default function ShowLoadingRequestApproveModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
  data,
  selectedId,
}) {
  const [zone, setZone] = useState(data.zoneId);
  const auth = useContext(AuthContext);
  const [quantity, setQuantity] = useState(data.quantity);
  const [error, setError] = useState();

  const { data: zones } = useFetch(`zones`);

  const headCells = [
    {
      id: "TripNo",
      numeric: false,
      disablePadding: true,
      label: "TripNo",
    },
    {
      id: "CustomerOrderId",
      numeric: true,
      disablePadding: false,
      label: "Customer Order Id",
    },
    {
      id: "Product",
      numeric: true,
      disablePadding: false,
      label: "Product",
    },
    {
      id: "TripDate",
      numeric: true,
      disablePadding: false,
      label: "Trip Date",
    },

    {
      id: "VehiclePlateNumber",
      numeric: true,
      disablePadding: false,
      label: "Vehicle Plate Number",
    },
    {
      id: "DriverName",
      numeric: true,
      disablePadding: false,
      label: "Driver Name",
    },
  ];

  const handleApprove = async () => {
    try {
      const input = {
        zoneId: +zone,
        quantity: +quantity,
      };

      await axios.put(
        `api/CustomerTrips/${selectedId}/loading-request/${data.id}`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      console.log("done");
      return true;
    } catch (error) {
      console.log(
        "🚀 ~ file: EnterCustomer.jsx:39 ~ submitEnterGate ~ error:",
        error
      );
      if (error.request.response) {
        setError(JSON.parse(error.request.response).title);
      } else setError("error");
    }
  };
  const handleSubmit = async () => {
    const done = await handleApprove();
    if (done) {
      saveFcn(selectedId);
    }
  };
  return (
    <>
      <Modal
        showSave={true}
        title={title}
        closeModal={() => closeModal(selectedId)}
        type={type}
        saveFcn={handleSubmit}
        cancelFcn={() => cancelFcn(selectedId)}
        withCancel={withCancel}
      >
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Zone</label>
              <select
                className="w-full px-3 py-2 border rounded-lg text-gray-700"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
              >
                <option value={null}>Select Zone</option>
                {zones?.map((elem) => (
                  <option value={elem.id}>{elem.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Approved Quantity</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg text-gray-700"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                }}
              />
            </div>

            <div></div>
          </div>
          <span className="font-semibold text-red-500">{error} </span>
          {/* <EnhancedTable rows={[]} headCells={headCells} /> */}{" "}
        </div>
      </Modal>
    </>
  );
}
