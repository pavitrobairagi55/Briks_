import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";

import Modal from "../../../components/Modal";

export default function AddUserModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
}) {
  const auth = useContext(AuthContext);
  const [location, setLoaction] = useState();
  const [locationsList, setLocationsList] = useState([]);
  const [role, setRole] = useState();
  const [rolesList, setRolesList] = useState([]);
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();

  useEffect(() => {
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
      } catch (error) {}
    };

    fetchData();
  }, []);
  const saveData = async () => {
    let preceed = true;
    if (!role || !location || !firstName || !lastName || !email) {
      setError("Please fullfill all the requested infomation");
      preceed = false;
    }
    if (preceed) {
      setIsLoading(true);
      try {
        const input = {
          firstname: firstName,
          lastName: lastName,
          email: email,
          role: role,
          locationId: +location,
        };

        await axios.post("api/Users", input, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        });

        saveFcn();
      } catch (error) {
        setIsLoading(false);

        setError(JSON.parse(error.request.responseText).title);
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
            <label className="block mb-2">Location</label>
            <select
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={location}
              onChange={(e) => setLoaction(e.target.value)}
            >
              <option value={null}>Select Location</option>
              {locationsList.map((elem) => (
                <option value={elem.id} key={elem.id}>
                  {elem.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Role</label>
            <select
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
              }}
            >
              <option value={null}>Select Role</option>

              {rolesList.map((elem) => (
                <option value={elem.name} key={elem.id}>
                  {elem.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">First Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
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
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div></div>
          <span className="font-semibold text-red-500">{error} </span>
        </div>
      </Modal>
    </>
  );
}
