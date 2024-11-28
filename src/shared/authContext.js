import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  userData: null,
  tokenExpirationDate: null,
  navItems: [],
  role: [],
  login: () => {},
  logout: () => {},
  isLoading: false,
  isRefreshModalOpen: false,
  refreshToken: null,
  refreshTokenFcn: () => {},
  updateProfile: () => {},
});

/* export const AuthContext = AuthContext1; */
