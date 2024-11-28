import { useContext, useEffect, useState } from "react";
import Modal from "./Modal";
import { AuthContext } from "../shared/authContext";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

export default function RefreshModal({ error }) {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const [remainingTime, setRemainingTime] = useState(
    new Date(auth.tokenExpirationDate).getTime() - new Date().getTime()
  );
  const keeplogged = () => {
    setIsLoading(true);

    auth.refreshTokenFcn(false);
  };
  const logout = () => {
    setIsLoading(true);
    navigate(`/`, { replace: true });
    auth.logout();
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1000); // Subtract 1 second every second
    }, 1000);

    return () => clearInterval(intervalId);
    // Cleanup interval on component unmount
  }, []);
  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const formattedTime = `${minutes}:${seconds % 60}`;
    return formattedTime;
  };
  return (
    <>
      <Modal
        showSave={false}
        title="Session Expiry Warning"
        closeModal={logout}
      >
        <p className="text-lg text-center text-gray-700 font-semibold mb-4">
          It looks like your session is about to expire. Are you still here?
        </p>
        <p className="text-lg text-center text-gray-700 font-semibold mb-4">
          Time remaining: {formatTime(remainingTime)}
        </p>
        {error && <span className="font-semibold text-red-500">{error} </span>}
        <div className="flex items-center  mx-auto justify-center mt-10 mb-8 flex gap-5 items-center">
          <button
            disabled={isLoading}
            className="bg-[#FF0854] px-5 py-2 text-white rounded-lg"
            onClick={logout}
          >
            No, Log me Out
          </button>
          <button
            disabled={isLoading}
            className="bg-[#0133C3] px-6 py-2 text-white rounded-xl mr-2 flex items-center"
            onClick={keeplogged}
          >
            {isLoading && (
              <CircularProgress
                size={20}
                style={{ color: "white", marginRight: 6 }}
              />
            )}
            Yes! Keep me logged In
          </button>
        </div>
      </Modal>
    </>
  );
}
