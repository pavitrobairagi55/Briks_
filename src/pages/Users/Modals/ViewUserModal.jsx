import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";

import Modal from "../../../components/Modal";

export default function ViewUserModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  Editable,
  withCancel,
  data,
}) {
  const auth = useContext(AuthContext);
  const [location, setLoaction] = useState(data.locationId);
  const [locationsList, setLocationsList] = useState([]);

  const [role, setRole] = useState(data.role);
  const [rolesList, setRolesList] = useState([]);
  const [firstName, setFirstName] = useState(data.firstname);
  const [lastName, setLastName] = useState(data.lastname);
  const [email, setEmail] = useState(data.email);

  useEffect(() => {
    if (Editable) {
      fetchData();
    }
  }, []);
  const fetchData = async () => {
    try {
      const locationResponse = await axios.get("/api/locations", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      setLocationsList(locationResponse.data);

      const rolesResponse = await axios.get("api/role", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setRolesList(rolesResponse.data);
      setRole(rolesResponse.data.find((elem) => elem.name === data.role)?.id);
    } catch (error) {}
  };
  return (
    <>
      <Modal
        showSave={true}
        title={title}
        closeModal={closeModal}
        type={type}
        saveFcn={saveFcn}
        cancelFcn={cancelFcn}
        withCancel={withCancel}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Location</label>
            {Editable ? (
              <select
                className="w-full px-3 py-2 border rounded-lg text-gray-700"
                disabled={Editable ? false : true}
                value={location}
                onChange={(e) => setLoaction(e.target.value)}
              >
                {locationsList.map((elem) => (
                  <option value={elem.id} key={elem.id}>
                    {elem.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg text-gray-700"
                disabled={Editable ? false : true}
                value={data.locationName}
                onChange={(e) => {
                  setLoaction(e.target.value);
                }}
              />
            )}
          </div>
          <div>
            <label className="block mb-2">Role</label>
            {Editable ? (
              <select
                className="w-full px-3 py-2 border rounded-lg text-gray-700"
                disabled={Editable ? false : true}
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                }}
              >
                <option value={null}>Select Option</option>

                {rolesList.map((elem) => (
                  <option value={elem.id} key={elem.id}>
                    {elem.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg text-gray-700"
                disabled={Editable ? false : true}
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                }}
              />
            )}
          </div>
          <div>
            <label className="block mb-2">First Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              disabled={Editable ? false : true}
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block mb-2">Last Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              disabled={Editable ? false : true}
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block mb-2">email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              disabled={Editable ? false : true}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
