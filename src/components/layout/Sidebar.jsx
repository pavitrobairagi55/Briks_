/* eslint-disable react/prop-types */
import { Card, List, ListItem, ListItemPrefix } from "@material-tailwind/react";

import logo from "../../assets/logo_adobe.png";
import { useContext, useEffect, useState } from "react";
import MyNavBar from "./MyNavBar";
import { AuthContext } from "./../../shared/authContext";
import { NavLink } from "react-router-dom";
import { Modal } from "@mui/material";
import RefreshModal from "../RefreshModal";

export function Sidebar({ children }) {
  const auth = useContext(AuthContext);
  console.log(
    "🚀 ~ Sidebar ~ auth.isRefreshModalOpen:",
    auth.isRefreshModalOpen
  );

  const menuItems = auth.navItems.sort((a, b) => {
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

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <div
        className={`main flex h-screen ${
          sidebarOpen ? "open-side-bar" : "closed-side-bar"
        }`}
      >
        <div className="overflow-y-scroll side-bar">
          <Card className=" p-1 text-black text-red">
            <div className="  flex flex-col items-center justify-center pb-4 border-b-2 mb-3">
              <img src={logo} alt="Logo" className="mt-2 w-20 h-20 logo" />
              <div className="font-weight-light font-bold text-center mt-4 text-xs hide-close">
                ADOBE MATERIALS
              </div>
              <div className="font-weight-light text-center mt-1 text-xs hide-close">
                PROCESS FACILITY
              </div>
              <div className="font-weight-light text-center mt-1 text-xs hide-close">
                AL-JUBAYLA, K.S.A
              </div>
            </div>

            <List className="p-0">
              {menuItems.map((item, index) => (
                <NavLink
                  key={index}
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className={({ isActive }) =>
                    isActive
                      ? " flex gap-3 bg-[#DCC3B8] rounded-xl w-full	py-1 pl-2 text-white	"
                      : "flex gap-3 pl-2"
                  }
                  to={item.route}
                >
                  <ListItem className="my-3 nav-btn">
                    <ListItemPrefix className="mr-2">
                      <i className={item.icon} aria-hidden="true"></i>
                    </ListItemPrefix>
                    <span> {item.name}</span>
                  </ListItem>
                </NavLink>
              ))}
            </List>
          </Card>
        </div>

        <div className="side-content">
          <MyNavBar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
          {children}

          {auth.token &&
            auth.isRefreshModalOpen &&
            console.log("isRefreshModalOpen:", auth.isRefreshModalOpen) && (
              <RefreshModal />
            )}
        </div>
      </div>
    </>
  );
}
