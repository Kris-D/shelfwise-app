// import menu from "../../data/sidebar";
import "./Sidebar.scss";
import { HiMenuAlt3 } from "react-icons/hi";
import SidebarItem from "./SidebarItem";
import headerlogo from "../../assets/shelfapp.svg";
import { useState } from "react";
import menu from "../../data/sidebar";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  const navigate = useNavigate();

  const goHome = () => {
    navigate ("/")
  }
  return (
    <div className="layout">
      <div className="sidebar" style={{ width: isOpen ? "230px" : "60px" }}>
        <div className="top_section">
          <div className="logo" style={{ display: isOpen ? "block" : "none" }}>
            <img
              src={headerlogo}
              alt="ShelfApp Logo"
              style={{ cursor: "pointer" }}
              onClick={goHome}
            />
          </div>
          <div className="bars" style={{ marginLeft: isOpen ? "100px" : "0px", cursor: "pointer" }}>
            <HiMenuAlt3 onClick={toggle} />
          </div>
        </div>
       {menu.map((item, index) => {
         return <SidebarItem key={index} item={item} isOpen={isOpen} />
       })}

      </div>
      <main style={{ paddingLeft: isOpen ? "230px" : "60px", transition: "all 5s " }}>{children}</main>
    </div>
  );
};

export default Sidebar;
