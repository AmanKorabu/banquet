import React, { useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { NavLink, useNavigate } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaHome } from "react-icons/fa";


function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef(null);
    const buttonRef = useRef(null);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsOpen((prev) => !prev);
    };

    // Close sidebar if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, []);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("user"); // Clear login info
        toast.error(
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <TbLogout2 /> Logged out successfully
            </div>
        );
        navigate("/"); // Redirect to login
    };


    return (
        <>
            <header className="header" >
                <GiHamburgerMenu
                    ref={buttonRef}
                    size={25}
                    onClick={toggleSidebar}
                    className="hamburger-icon"
                />
                <NavLink to="/dashboard"> <FaHome size={30} /></NavLink>
            </header>

            <aside ref={sidebarRef} className={`sidebar ${isOpen ? "open" : "close"}`}>
                <nav>
                    <ul>
                        <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <FaHome size={30} />
                            <NavLink to="/dashboard">Home </NavLink>
                        </li>
                        <li>
                            <NavLink to="/orders">Orders</NavLink>
                        </li>
                        <li>
                            <NavLink to="/customers">Customers</NavLink>
                        </li>
                        <li>
                            <NavLink to="/reports">Reports</NavLink>
                        </li>
                        <li>
                            <NavLink to="/settings">Settings</NavLink>
                        </li>
                        <li className="logout" onClick={handleLogout}>
                            <TbLogout2 />
                            <span>Logout</span>
                        </li>
                    </ul>
                </nav>
            </aside>
        </>
    );
}

export default Header;
