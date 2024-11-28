import { useState, useCallback, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "../api/axios";

let logoutTimer;
let refreshModalTimer;
export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isRefreshModalOpen, setIsRefreshModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [navItems, setNavItems] = useState([]);
  const [role, setRole] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const login = useCallback((token, user, refreshToken, fromLogin) => {
    setToken(token);
    setRefreshToken(refreshToken);
    setUserId(0);
    setUserData(user);

    setNavItems(user.menus);
    setRole(user.userRoles);
    const expiresIn = user.expiresIn;
    const now = new Date();
    now.setSeconds(now.getSeconds() + expiresIn);
    const tokenExpirationDate = localStorage.getItem("tokenExpirationDate")
      ? new Date(localStorage.getItem("tokenExpirationDate"))
      : now;
    const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();

    setTokenExpirationDate(tokenExpirationDate);

    // Set the logout timer
    logoutTimer = setTimeout(logout, remainingTime);
    if (!fromLogin) {
      refreshModalTimer = setTimeout(
        () => setIsRefreshModalOpen(true),
        remainingTime - 60 * 1000
      );
    }
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userData", JSON.stringify(user));
    localStorage.setItem("navItems", JSON.stringify(user.menus));
    localStorage.setItem("role", user.userRoles);
    localStorage.setItem(
      "tokenExpirationDate",
      tokenExpirationDate.toISOString()
    );
  }, []);

  const refreshTokenFcn = async (fromLogin) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await axios.post(
      "refresh",
      { refreshToken },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    const newToken = response.data.accessToken;
    const newRefreshToken = response.data.refreshToken;
    clearTimeout(logoutTimer);
    clearTimeout(refreshModalTimer);

    localStorage.removeItem("tokenExpirationDate");
    setIsRefreshModalOpen(false);
    login(newToken, userData, newRefreshToken, false);
    if (!fromLogin) {
      window.location.reload();
    }
  };

  const updateProfile = async () => {
    const menus = JSON.parse(localStorage.getItem("navItems"));
    const accessToken = localStorage.getItem("token");
    const response = await axios.get("api/UserProfile", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    });
    const user = response.data;
    user.menus = menus;
    localStorage.setItem("userData", JSON.stringify(user));
    window.location.reload();
  };
  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setUserData(null);
    setRefreshToken(null);
    setIsRefreshModalOpen(false);
    setNavItems([]);
    setRole([]);

    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("navItems");
    localStorage.removeItem("role");
    localStorage.removeItem("tokenExpirationDate");
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("userData"));
    const refreshToken = localStorage.getItem("refreshToken");

    if (token && userData) {
      login(token, userData, refreshToken, false);
    }
    setIsLoading(false);
  }, []);

  return {
    token,
    login,
    logout,
    userId,
    userData,
    navItems,
    role,
    isLoading,
    isRefreshModalOpen,
    refreshTokenFcn,
    updateProfile,
    refreshToken,
    tokenExpirationDate,
  };
};
