import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../shared/authContext";
import avatar from "../../assets/avatar.jpeg";
import Modal from "../Modal";
import FileInputButton from "../FileInputButton";
import axios from "../../api/axios";
import DOMPurify from "dompurify";

import {
  Menu,
  Notifications,
  ArrowBackIos,
  ArrowForwardIos,
} from "@mui/icons-material/";
import { DatePicker } from "@mui/x-date-pickers";
import { useNavigate } from "react-router-dom";
import { formatDate, uploadFile, uploadFileUrl } from "../../utils";
import { VITE_FILE_URL } from "../../envirement";
import useFetch from "../../shared/useFetch";

const MyNavBar = ({ toggleSidebar, sidebarOpen }) => {
  const auth = useContext(AuthContext);
  const customerName = auth.userData.firstName + " " + auth.userData.lastName;
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalPasswordOpen, setModalPasswordOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState();
  const [error, setError] = useState();

  const [isLoading, setIsLoading] = useState();

  const [newPassword, setNewPassword] = useState();

  const [locations, setLocations] = useState([]);

  const [profileImage, setProfileImage] = useState(
    VITE_FILE_URL + auth.userData.profileImage || avatar
  );
  const [newProfileImage, setNewProfileImage] = useState();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(auth.userData.firstName || "");
  const [lastName, setLastName] = useState(auth.userData.lastName || "");
  const [mobile, setMobile] = useState(auth.userData.mobile || "");
  const [email, setEmail] = useState(auth.userData.email || "");
  const [password, setPassword] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(
    auth.userData.locationId || null
  );
  const [crNumber, setCrNumber] = useState(auth.userData.crNumber || "");
  const [vatNumber, setVatNumber] = useState(auth.userData.vatNumber || "");

  const [contactInformation, setContactInformation] = useState(
    auth.userData.contactInformation || ""
  );
  const [contractDate, setContractDate] = useState(
    auth.userData.contractDate || ""
  );
  const [contractNumber, setContractNumber] = useState(
    auth.userData.contractNumber || ""
  );
  const [secondPersonUser, setSecondPersonUser] = useState(
    auth.userData.secondPersonUser || ""
  );

  const [authorizedPerson, setAuthorizedPerson] = useState(
    auth.userData.authorizedPerson || ""
  );

  const [ContactLandLine, setContactLandLine] = useState(
    auth.userData.ContactLandLine || ""
  );
  let { data: notificationsList, fetchData } = useFetch("Notifications");

  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const handleNotificationClick = () => {
    setNotificationOpen(!isNotificationOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/locations", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        });

        setLocations(response.data);
      } catch (error) {}
    };

    fetchData();
  }, []);

  const today = new Date();
  const date = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    right: 0,
  });
  const dropdownRef = useRef(null);
  const dropdownRefNotif = useRef(null);

  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleOpenPasswordModal = () => {
    setModalPasswordOpen(true);
  };
  const handleClosePasswordModal = () => {
    setError(null);
    setModalPasswordOpen(false);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const calculateDropdownPosition = () => {
    const userInfoElement = dropdownRef.current;

    if (userInfoElement) {
      const rect = userInfoElement.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        right: window.innerWidth - rect.right,
      });
    }
  };

  const handleLocationChange = (selectedLocationId) => {
    setSelectedLocation(selectedLocationId);
  };

  useEffect(() => {
    if (isDropdownOpen) {
      calculateDropdownPosition();
    }
  }, [isDropdownOpen]);
  const calculateDropdownPositionNotif = () => {
    const dropdownElement = dropdownRefNotif.current;
    if (dropdownElement) {
      const rect = dropdownElement.getBoundingClientRect();
      // Calculate the position as before
      const newPosition = {
        top: rect.bottom + window.scrollY,
        right: window.innerWidth - rect.right,
      };
      // Add an offset of 200px to the right position
      newPosition.right -= 200;
      setDropdownPosition(newPosition);
    }
  };

  // Update dropdown position when notifications dropdown is opened
  useEffect(() => {
    if (isNotificationOpen) {
      calculateDropdownPositionNotif();
    }
  }, [isNotificationOpen]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest(".logout-button")) {
        return;
      }

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
      if (
        dropdownRefNotif.current &&
        !dropdownRefNotif.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };

    window.addEventListener("resize", calculateDropdownPosition);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", calculateDropdownPosition);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleReset = async () => {
    try {
      const input = {
        email: auth.userData.email,
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
        setError(responseUpdate.data.errors[0].description);
        return;
      }
      handleClosePasswordModal();
      auth.logout();
    } catch (error) {
      setError("error");
    }
  };
  const handleDateChange = (date) => {
    setContractDate(dayjs(date).format("YYYY-MM-DD"));
  };

  const logout = () => {
    navigate(`/`, { replace: true });
    auth.logout();
  };

  const updateProfile = async () => {
    setIsLoading(true);
    const input = {
      crNum: crNumber,
      vatNum: vatNumber,
      contactLandLine: ContactLandLine,
      seContactInformation: contactInformation,
      seContractNumber: contractNumber,
      secondPersonUser: secondPersonUser,
      contractDate: contractDate,
      locationId: selectedLocation,
      firstName: firstName,
      lastName: lastName,
      profileImage: auth.userData.profileImage,
      email: email,
      mobile: mobile,
      authorizedPerson: authorizedPerson,
      userRoles: [auth?.role?.toString()] || [],
    };
    if (newProfileImage && newProfileImage !== profileImage) {
      let imageId = await uploadFileUrl(newProfileImage, auth);
      input.profileImage = imageId;
    }
    try {
      await axios.put("api/UserProfile", input, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      setModalOpen(false);
      setIsLoading(false);
      auth.updateProfile();
    } catch (error) {
      console.log("🚀 ~ saveData ~ error:", error);
      setIsLoading(false);

      setError(error.response?.data);
    }
  };
  const handleDeleteNotification = async (notificationId) => {
    try {
      await axios.delete(`/api/Notifications/${notificationId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      fetchData();
    } catch (error) {
      // Handle error if deletion fails
      console.error("Error deleting notification:", error);
    }
  };
  const handleMarkNotificationSeen = async (notificationId) => {
    try {
      await axios.post(
        `/api/Notifications/${notificationId}`,
        {
          isRead: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      fetchData();
    } catch (error) {
      // Handle error if marking notification as seen fails
      console.error("Error marking notification as seen:", error);
    }
  };

  return (
    <div className="bg-[#DCC3B8] flex items-center justify-between p-2 relative">
      <div className="bg-[#DCC3B8] flex items-center">
        {sidebarOpen ? (
          <button
            onClick={toggleSidebar}
            className="hide-mob h-full px-4  absolute left-0 rounded-s-full bg-[#1c2a4c] -translate-x-full	text-white"
          >
            <ArrowBackIos />
          </button>
        ) : (
          <button
            onClick={toggleSidebar}
            className="hide-mob h-full px-4  absolute left-0 rounded-e-full bg-[#1c2a4c] 	text-white"
          >
            <ArrowForwardIos />
          </button>
        )}
        <div
          ref={dropdownRefNotif}
          className="bg-[#DCC3B8] flex items-center justify-between p-2 "
        >
          <div className="bg-[#DCC3B8] flex items-center lg:ml-20">
            <Notifications
              sx={{ color: "white" }}
              onClick={() => handleNotificationClick()}
            />
          </div>
          {isNotificationOpen && (
            <div
              className="absolute"
              style={{
                top: dropdownPosition.top,
                right: dropdownPosition.right,
                zIndex: 10,
                backgroundColor: "#FDFEFE",
                color: "gray",
                borderRadius: "12px",
                boxShadow: "md",
                padding: "1rem",
                width: "16rem",
                maxHeight: "30rem",
                overflowY: "auto",
              }}
            >
              <h4 className="text-lg font-semibold mb-2">Notifications</h4>
              <div className="space-y-4">
                {notificationsList &&
                  notificationsList.map((notification, index) => (
                    <div
                      key={notification.id}
                      className={`p-2 rounded-sm ${
                        !notification.isRead ? "bg-[#f0f0f0] text-[#666]" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500">
                            {formatDate(notification.date)}
                          </span>
                          <span className="ml-auto text-xs text-gray-500">
                            •
                          </span>
                          <span className="text-xs text-gray-500">
                            {notification.time}
                          </span>
                        </div>
                        <div>
                          {!notification.isRead && (
                            <button
                              className="text-gray-500 hover:text-blue-500 mr-4"
                              onClick={() =>
                                handleMarkNotificationSeen(notification.id)
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 cursor-pointer"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </button>
                          )}
                          <button
                            className="text-gray-500 hover:text-red-500"
                            onClick={() =>
                              handleDeleteNotification(notification.id)
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 cursor-pointer"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <h5 className="text-sm font-medium mt-1">
                        {notification.title}
                      </h5>
                      <p
                        className="text-sm text-gray-600"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(notification.body),
                        }}
                      />
                      {index !== notificationsList.length - 1 && (
                        <hr className="my-2 border-gray-200" />
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <nav className=" bg-[#DCC3B8] flex items-center justify-between">
        <div className="relative flex items-center mr-10">
          <div
            ref={dropdownRef}
            className="flex items-center gap-2 cursor-pointer bg-[#DCC3B8]"
            onClick={toggleDropdown}
          >
            <div className="text-white">
              <div className="text-white font-medium bg-[#DCC3B8]">
                {customerName}
              </div>
              <div className="text-white text-sm bg-[#DCC3B8]">{date}</div>
            </div>
            <img
              src={profileImage} // Add your user photo source
              alt="User Photo"
              className="w-14 h-14 rounded-full object-cover"
            />
          </div>
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              className="bg-white text-gray-800 rounded-lg mt-2 absolute right-0 z-10 w-36"
              style={{
                top: dropdownPosition.top,
                right: dropdownPosition.right,
              }}
            >
              <button
                onClick={handleOpenModal}
                className="logout-button block px-4 py-2"
              >
                <i className="fa fa-user mr-5" aria-hidden="true"></i>Profile
              </button>
              <button
                className="logout-button block px-4 py-2"
                onClick={handleOpenPasswordModal}
              >
                <i className="fa-solid fa-key mr-5" aria-hidden="true"></i>
                Password
              </button>
              <button
                className="logout-button block px-4 py-2"
                onClick={logout}
              >
                <i className="fa fa-lock mr-5" aria-hidden="true"></i>Logout
              </button>
            </div>
          )}
          {isModalOpen && (
            <Modal
              showSave={true}
              title={"Profile Details"}
              closeModal={handleCloseModal}
              type={"Edit"}
              saveFcn={updateProfile}
              cancelFcn={handleCloseModal}
              withCancel={true}
              isLoading={isLoading}
            >
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-3/5 px-6 md:border-r-2">
                  <h4 className="text-lg font-medium text-slate-500">
                    User Details
                  </h4>
                  <div className="mt-10">
                    <div className="flex flex-col md:flex-row md:justify-between md:mb-3">
                      <div className="w-1/2">
                        <p className="text-slate-500 pb-2">FirstName</p>
                        <input
                          className="border-2 border-gray-300 rounded-md px-3 py-2 w-64 text-slate-500"
                          name="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          type="text"
                        />
                      </div>
                      <div className="w-1/2">
                        <p className="text-slate-500 pb-2">LastName</p>
                        <input
                          className="border-2 border-gray-300 rounded-md px-3 py-2 w-64 text-slate-500"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:justify-between md:mb-3">
                      <div className="w-1/2">
                        <p className="text-slate-500 pb-2">Mobile</p>
                        <input
                          className="border-2 border-gray-300 rounded-md px-3 py-2 w-64 text-slate-500"
                          type="text"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                        />
                      </div>
                      <div className="w-1/2">
                        <p className="text-slate-500 pb-2">Email</p>
                        <input
                          className="border-2 border-gray-300 rounded-md px-3 py-2 w-64 text-slate-500"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:justify-between md:mb-3">
                      <div className="w-1/2">
                        <p className="text-slate-500 pb-2">Location</p>
                        <select
                          className="border-2 border-gray-300 rounded-md px-3 py-2 w-64 text-slate-500"
                          onChange={(e) => handleLocationChange(e.target.value)}
                        >
                          <option value="">selectLocation</option>
                          {locations.map((location, index) => (
                            <option key={index} value={location.id}>
                              {location.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:justify-between md:mb-3">
                      <div className="w-1/2">
                        <p className="text-slate-500 pb-2">Cr Number</p>
                        <input
                          className="border-2 border-gray-300 rounded-md px-3 py-2 w-64 text-slate-500"
                          type="number"
                          value={crNumber}
                          onChange={(e) => setCrNumber(e.target.value)}
                        />
                      </div>
                      <div className="w-1/2">
                        <p className="text-slate-500 pb-2">Vat Number</p>
                        <input
                          className="border-2 border-gray-300 rounded-md px-3 py-2 w-64 text-slate-500"
                          type="text"
                          value={vatNumber}
                          onChange={(e) => setVatNumber(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:justify-between md:mb-3">
                      <div className="w-1/2">
                        <p className="text-slate-500 pb-2">
                          SeContact Information
                        </p>
                        <input
                          className="border-2 border-gray-300 rounded-md px-3 py-2 w-64 text-slate-500"
                          type="text"
                          value={contactInformation}
                          onChange={(e) =>
                            setContactInformation(e.target.value)
                          }
                        />
                      </div>
                      <div className="w-1/2">
                        <p className="text-slate-500 pb-2">Contract Date</p>
                        <DatePicker
                          value={contractDate}
                          onChange={handleDateChange}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:justify-between md:mb-3">
                      <div className="w-1/2">
                        <p className="text-slate-500 pb-2">SeContract Number</p>
                        <input
                          className="border-2 border-gray-300 rounded-md px-3 py-2 w-64 text-slate-500"
                          type="text"
                          value={contractNumber}
                          onChange={(e) => setContractNumber(e.target.value)}
                        />
                      </div>
                      <div className="w-1/2">
                        <p className="text-slate-500 pb-2">
                          Second Person User
                        </p>
                        <input
                          className="border-2 border-gray-300 rounded-md px-3 py-2 w-64 text-slate-500"
                          type="text"
                          value={secondPersonUser}
                          onChange={(e) => setSecondPersonUser(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:justify-between md:mb-3">
                      <div className="w-1/2">
                        <p className="text-slate-500 pb-2">Authorized Person</p>
                        <input
                          className="border-2 border-gray-300 rounded-md px-3 py-2 w-64 text-slate-500"
                          type="text"
                          value={authorizedPerson}
                          onChange={(e) => setAuthorizedPerson(e.target.value)}
                        />
                      </div>
                      <div className="w-1/2">
                        <p className="text-slate-500 pb-2">ContactLand Line</p>
                        <input
                          className="border-2 border-gray-300 rounded-md px-3 py-2 w-64 text-slate-500"
                          type="text"
                          value={ContactLandLine}
                          onChange={(e) => setContactLandLine(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full sm:w-2/5 px-6">
                  <h4 className="text-lg font-medium text-slate-500">
                    Picture Profile
                  </h4>
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src={profileImage}
                      alt="profileImage"
                      className="my-10 w-22 h-22"
                    />
                    <FileInputButton
                      setImage={setProfileImage}
                      setNewProfileImage={setNewProfileImage}
                    />
                  </div>
                </div>
              </div>
            </Modal>
          )}
          {isModalPasswordOpen && (
            <Modal
              showSave={true}
              title={"Edit Password"}
              closeModal={handleClosePasswordModal}
              type={"Edit"}
              saveFcn={handleReset}
              cancelFcn={handleClosePasswordModal}
              withCancel={true}
            >
              <div className="flex items-center justify-center">
                <div className="bg-white p-8">
                  <p className="text-slate-500 pb-2 ">
                    Email: <b className="text-lg">{auth.userData.email}</b>
                  </p>
                  <div className="mb-4">
                    <p className="text-slate-500 pb-2">Old Password</p>
                    <input
                      className="border-2 border-gray-300 rounded-md px-3 py-2 w-full text-slate-500"
                      name="Old Password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      type="password"
                    />
                  </div>
                  <div className="mb-4">
                    <p className="text-slate-500 pb-2">New Password</p>
                    <input
                      className="border-2 border-gray-300 rounded-md px-3 py-2 w-full text-slate-500"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      type="password"
                    />
                  </div>
                </div>
              </div>
              {error && (
                <span className="font-semibold text-red-500">{error} </span>
              )}
            </Modal>
          )}
        </div>
      </nav>
      <button onClick={toggleSidebar} className="hide-web text-white">
        <Menu />
      </button>
    </div>
  );
};

export default MyNavBar;
