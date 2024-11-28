import { useContext, useState } from "react";
import { Sidebar } from "../../components/layout/Sidebar";
import useFetch from "../../shared/useFetch";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../shared/authContext";
import { formatDate } from "../../utils";
import axios from "../../api/axios";
function EnterRequest() {
  const auth = useContext(AuthContext);

  const [confirmed, setConfirmed] = useState(false);
  const params = useParams();
  const id = params.id;
  const { data, isLoading } = useFetch(`Trips/${id}`);
  const [loader, setLoader] = useState(false);

  const userHasAccess = () =>
    auth?.role[0] === "AL-QASAB-GUARD" || auth?.role[0] === "SUPER ADMIN";

  const submitEnterGate = async () => {
    setLoader(true);
    try {
      await axios.put(
        `api/Trips/enter-jubila/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setConfirmed(true);
      setLoader(false);
    } catch (error) {
      console.log(
        "🚀 ~ file: EnterCustomer.jsx:39 ~ submitEnterGate ~ error:",
        error
      );
      setLoader(false);
    }
  };

  return (
    <>
      <Sidebar>
        {isLoading && (
          <p className="flex flex-col items-center justify-center mt-10 text-xl font-semibold mb-5">
            Loading...
          </p>
        )}
        {!userHasAccess() && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Access Denied!</strong>
            <span className="block sm:inline">
              {" "}
              You do not have permission to access this page.
            </span>
          </div>
        )}
        {!isLoading &&
          userHasAccess() &&
          data?.masterTripStatus?.secretCode?.toLowerCase() === "loaded" && (
            <div className="flex flex-col items-center justify-center mt-10">
              <p className="text-xl font-semibold mb-5">Trip info:</p>
              <p className="text-l font-semibold mb-5">ID: {data?.id}</p>
              <p className="text-l font-semibold mb-5">
                Trip date: {formatDate(data?.date)}
              </p>
              <p className="text-l font-semibold mb-5">
                Vehicle plate number: {data?.vehicle?.vehiclePlateNumber}
              </p>
              <p className="text-l font-semibold mb-5">
                Driver name: {data?.driver?.driverName}
              </p>
              <p className="text-l font-semibold mb-10">
                Are you sure you want to accept this trip?
              </p>
              {!confirmed && !loader && (
                <button
                  className=" px-3 py-2 text-white bg-green-600 rounded-md hover:text-green-600 hover:bg-white focus:outline-none"
                  onClick={submitEnterGate}
                >
                  Confirm
                </button>
              )}
              {loader && (
                <button className="text-xl font-semibold text-gray-600 ">
                  please wait ...
                </button>
              )}
              {confirmed && !loader && (
                <button className="text-xl font-semibold text-green-600 ">
                  Trip Confirmed
                </button>
              )}
            </div>
          )}
        <div className="flex flex-col items-center justify-center mt-10 text-xl font-semibold mb-5">
          {userHasAccess() &&
            data?.masterTripStatus?.secretCode?.toLowerCase() !== "loaded" &&
            !loader &&
            !isLoading && (
              <button className="text-xl font-semibold text-green-600 ">
                Trip is not on loaded Status
              </button>
            )}
        </div>
      </Sidebar>
    </>
  );
}

export default EnterRequest;
