import { useState, useEffect, useContext } from "react";
import logo from "../../assets/logo_adobe.png";
import axios from "../../api/axios";
import { AuthContext } from "../../shared/authContext";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    setErrMsg("");
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      setIsLoading(true);
      try {
        await axios.post("/forgotPassword", JSON.stringify({ email }), {
          headers: { "Content-Type": "application/json" },
        });
        setEmailSent(true);
      } catch (error) {
        if (!error.response) {
          setErrMsg("No Server Respons");
        }
        if (error.request.response) {
          setErrMsg(JSON.parse(error.request.response).title);
        } else {
          setErrMsg("Email incorrect");
        }
        setIsLoading(false);
      }
    }
  };

  return (
    <section className="flex items-start justify-center min-h-screen bg-[#F8F9FB]">
      <div className="mt-12 w-full max-w-lg mx-auto rounded-l shadow-md overflow-hidden md:max-w-2xl m-5">
        <div className="flex flex-col items-center justify-center p-6">
          <img src={logo} alt="Logo" className="mt-7 w-24 h-24" />
          <h1 className="font-weight-light text-center mt-7">
            Forgot Password
          </h1>
          <p aria-live="assertive" className="text-red-500">
            {errMsg}
          </p>
        </div>
        {!emailSent && (
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <input
                type="email"
                className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 focus:border-blue-300"
                placeholder="email"
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
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
                {isLoading ? "Loading..." : "Send"}
              </button>
            </div>
          </form>
        )}
        {emailSent && (
          <div className="mt-6 text-center text-green-600 mb-20">
            <p className="text-lg font-semibold">Success!</p>
            <p>
              We've sent you an email with instructions. Please check your
              inbox.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ForgotPassword;
