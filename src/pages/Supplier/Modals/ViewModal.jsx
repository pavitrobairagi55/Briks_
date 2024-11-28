import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../shared/authContext";
import axios from "../../../api/axios";
import Modal from "../../../components/Modal";

export default function ViewModal({
  title,
  closeModal,
  saveFcn,
  type,
  cancelFcn,
  withCancel,
  selectedId,
}) {
  const auth = useContext(AuthContext);
  const [data, setData] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [alternateEmail, setAlternateEmail] = useState();
  const [mobile, setMobile] = useState();
  const [mobile2, setMobile2] = useState();
  const [address, setAddress] = useState();
  const [address2, setAddress2] = useState();
  const [city, setCity] = useState();
  const [state, setState] = useState();
  const [country, setCountry] = useState();
  const [fax, setFax] = useState();
  const [pinCode, setpinCode] = useState();
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();

  const fetchData = async () => {
    const response = await axios.get(`api/suppliers/${selectedId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    });
    setData(response.data);
    setEmail(response.data?.email);
    setName(response.data?.name);
    setAlternateEmail(response.data?.alternateEmail);
    setMobile(response.data?.mobile);
    setMobile2(response.data?.alternateMobile);
    setAddress(response.data?.address1);
    setAddress2(response.data?.alternateMobile);
    setCity(response.data?.city);
    setState(response.data?.state);
    setCountry(response.data?.country);
    setFax(response.data?.fax);
    setpinCode(response.data?.postalCode);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const saveData = async () => {
    let preceed = true;
    if (!name || !email || !alternateEmail) {
      setError("Please fullfill all the requested infomation");
      preceed = false;
    }
    if (preceed) {
      setIsLoading(true);
      try {
        const input = {
          name: name,
          alternateEmail: alternateEmail,
          email: email,
          mobile: mobile,
          alternateMobile: mobile2,
          fax: fax,
          address1: address,
          address2: address2,
          city: city,
          state: state,
          postalCode: pinCode,
          country: country,
        };

        await axios.post("api/suppliers", input, {
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
            <label className="block mb-2">Name</label>
            <input
              disabled
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div></div>
          <div>
            <label className="block mb-2">Email</label>
            <input
              disabled
              type="email"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block mb-2">Alternate Email</label>
            <input
              disabled
              type="email"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={alternateEmail}
              onChange={(e) => {
                setAlternateEmail(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block mb-2">Mobile</label>
            <input
              disabled
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block mb-2">Alternate Mobile</label>
            <input
              disabled
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={mobile2}
              onChange={(e) => {
                setMobile2(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block mb-2">Address 1</label>
            <input
              disabled
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block mb-2">Address 2</label>
            <input
              disabled
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={address2}
              onChange={(e) => {
                setAddress2(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block mb-2">City</label>
            <input
              disabled
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block mb-2">State</label>
            <input
              disabled
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={state}
              onChange={(e) => {
                setState(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block mb-2">Country</label>
            <input
              disabled
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block mb-2">Fax</label>
            <input
              disabled
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={fax}
              onChange={(e) => {
                setFax(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block mb-2">Postal Code</label>
            <input
              disabled
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-gray-700"
              value={pinCode}
              onChange={(e) => {
                setpinCode(e.target.value);
              }}
            />
          </div>
          <span className="font-semibold text-red-500">{error} </span>
        </div>
      </Modal>
    </>
  );
}
