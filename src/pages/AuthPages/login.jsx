import { useState, useEffect, useRef, useContext } from "react";
import logo from "../../assets/logo_adobe.png";
import axios from "../../api/axios";
import { AuthContext } from "../../shared/authContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MENU_FILTER } from "../../envirement";

function Login() {
  const LOGIN_URL = "login";
  const UserRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const auth = useContext(AuthContext);

  useEffect(() => {
    UserRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const navigate = useNavigate();
  const Location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((email, password)) {
      setIsLoading(true);
      try {
        const response = await axios.post(
          LOGIN_URL,
          JSON.stringify({ email, password }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const { accessToken, expiresIn, refreshToken } = response.data;
        const isNew = localStorage.getItem("firstLogin");
        if (isNew) {
          navigate(`/updatePass/${email}`, { replace: true });
          return;
        }
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
          const updatedMenu = menuRequest?.data?.filter(
            (elem) => !MENU_FILTER.includes(elem.route)
          );

          user.menus = updatedMenu;
          user.expiresIn = expiresIn;

          auth.login(accessToken, user, refreshToken, true);
          auth.refreshTokenFcn(true);
          setEmail("");
          setPassword("");
          const homeLink = updatedMenu.sort((a, b) => {
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
          const origin = homeLink[0].route;

          navigate(origin, { replace: true });
        }
      } catch (error) {
        if (!error.response) {
          setErrMsg("No Server Respons");
        }
        if (error.request.response) {
          setErrMsg(JSON.parse(error.request.response).title);
        } else {
          setErrMsg("Email or Password incorrect");
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
            Sign in to continue.
          </h1>
          <p ref={errRef} aria-live="assertive" className="text-red-500">
            {errMsg}
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <input
              ref={UserRef}
              type="text"
              className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 focus:border-blue-300"
              placeholder="email"
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>
          <div className="p-6">
            <input
              type="password"
              className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 focus:border-blue-300"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
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
              {isLoading ? "Loading..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="p-6 flex justify-between items-center">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember_me"
              name="remember_me"
              className="rounded text-blue-500"
            />
            <label htmlFor="remember_me" className="ml-2">
              Keep me signed in
            </label>
          </div>
          <Link to={"/forgotPassword"} className="text-gray-500">
            Forgot Password
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Login;
