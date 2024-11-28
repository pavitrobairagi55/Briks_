import { useState, useEffect, useRef, useContext } from "react";
import logo from "../../assets/logo_adobe.png";
import axios from "../../api/axios";
import { AuthContext } from "../../shared/authContext";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const auth = useContext(AuthContext);

  useEffect(() => {
    setErrMsg("");
  }, [newPassword]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const email = params.get("email");

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const input = {
        email: email,
        resetCode: token,
        newPassword: newPassword,
      };

      const responseUpdate = await axios.post("/resetPassword", input, {
        headers: { "Content-Type": "application/json" },
      });
      setPasswordUpdated(true);
    } catch (error) {
      setIsLoading(false);

      if (error?.request?.response) {
        setErrMsg(
          JSON.parse(error.request.response)?.errors?.PasswordRequiresLower ||
            JSON.stringify(JSON.parse(error.request.response).errors) ||
            JSON.parse(error.request.response).title
        );
      } else {
        setErrMsg("Error, Please try again later");
      }
    }
  };

  return (
    <section className="flex items-start justify-center min-h-screen bg-[#F8F9FB]">
      <div className="mt-12 w-full max-w-lg mx-auto rounded-l shadow-md overflow-hidden md:max-w-2xl m-5">
        <div className="flex flex-col items-center justify-center p-6">
          <img src={logo} alt="Logo" className="mt-7 w-24 h-24" />
          <h1 className="font-weight-light text-center mt-7">Reset Password</h1>
          <h1 className="font-weight-light text-center mt-7">
            Please Enter Your New Password
          </h1>
          <p aria-live="assertive" className="text-red-500 font-semibold">
            {errMsg}
          </p>
        </div>
        {!passwordUpdated && token && (
          <form onSubmit={handleSubmit}>
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
              <button
                className={`w-full px-3 py-2 text-white rounded-md focus:outline-none ${
                  isLoading ? "bg-gray-500" : "bg-[#0033c4]"
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Save and Sign In"}
              </button>
            </div>
          </form>
        )}
        {passwordUpdated && token && (
          <div className="mt-6 text-center  mb-20">
            <p className="text-lg font-semibold text-green-600 my-5">
              Success!
            </p>
            <p className="text-green-600 my-5">
              Password Updated Successfully.
            </p>
            <Link to={"/login"} className="text-blue-600 my-10 font-semibold">
              <u>Please click here to sign in</u>
            </Link>
            .
          </div>
        )}
        {!token && (
          <div className="mt-6 text-center  mb-20">
            <p className="text-lg font-semibold text-red-600 my-5">Error!</p>
            <p className="text-red-600 my-5">Please try again.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ResetPassword;
