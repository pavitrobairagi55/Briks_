import { useState, useEffect, useRef, useContext } from "react";
import logo from "../../assets/logo_adobe.png";
import axios from "../../api/axios";
import { AuthContext } from "../../shared/authContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function UpdatePassword() {
  const LOGIN_URL = "login";

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const auth = useContext(AuthContext);

  useEffect(() => {
    setErrMsg("");
  }, [oldPassword, newPassword]);

  const navigate = useNavigate();
  const params = useParams();
  const email = params.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const input = {
        email: email,
        currentPassword: oldPassword,
        newPassword: newPassword,
      };

      const responseUpdate = await axios.put(
        "api/Users/reset-password",
        input,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!responseUpdate.data.succeeded) {
        setErrMsg(responseUpdate.data.errors[0].description);
        return;
      }
      localStorage.removeItem("firstLogin");

      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password: newPassword }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { accessToken, expiresIn } = response.data;

      if (accessToken) {
        const userRequest = await axios.get("api/UserProfile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        });
        const user = userRequest.data;
        const menuRequest = await axios.get("api/UserProfile/menu", {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        });
        user.menus = menuRequest.data;
        user.expiresIn = expiresIn;

        auth.login(accessToken, user);
        const homeLink = menuRequest.data.sort((a, b) => {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        const origin = homeLink[0];

        navigate(origin.route);
      }
    } catch (error) {
      if (!error.response) {
        setErrMsg("No Server Respons");
      }

      setErrMsg("Email or Password incorrect");
    }
  };

  return (
    <section className="flex items-start justify-center min-h-screen bg-[#F8F9FB]">
      <div className="mt-12 w-full max-w-lg mx-auto rounded-l shadow-md overflow-hidden md:max-w-2xl m-5">
        <div className="flex flex-col items-center justify-center p-6">
          <img src={logo} alt="Logo" className="mt-7 w-24 h-24" />
          <h1 className="font-weight-light text-center mt-7">
            Update Password
          </h1>
          <p aria-live="assertive" className="text-red-500 font-semibold">
            {errMsg}
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <label className="block mb-2">Old Password </label>
            <input
              type="password"
              className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 focus:border-blue-300"
              placeholder="Old Password"
              onChange={(e) => setOldPassword(e.target.value)}
              value={oldPassword}
              required
            />
          </div>
          <div className="p-6">
            <label className="block mb-2">New Password</label>

            <input
              type="password"
              className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 focus:border-blue-300"
              placeholder="New Password"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              required
            />
          </div>
          <div className="p-6">
            <button className="w-full px-3 py-2 text-white bg-[#0033c4] rounded-md focus:bg-blue-600 focus:outline-none">
              Save and Sign In
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default UpdatePassword;
