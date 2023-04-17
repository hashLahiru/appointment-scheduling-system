import React, { useState } from 'react';
import "../layout.css";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Badge } from "antd";
import { NotificationOutlined } from '@ant-design/icons';

function Layout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useSelector((state) => state.user);

    const navigate = useNavigate();
    const location = useLocation();
    const userMenu = [
        {
            name: "Home",
            path: "/",
            icon: "ri-home-line",
        },
        {
            name: "Appointments",
            path: `/appointments`,
            icon: "ri-file-list-line",
        },
        {
            name: "Apply Officer",
            path: "/apply-officer",
            icon: "ri-hospital-line",
          }
    ];

    const officerMenu = [
        {
            name: "Home",
            path: "/",
            icon: "ri-home-line",
        },
        
        {
            name: "Appointments",
            path: "/officer/appointments",
            icon: "ri-file-list-line",
        },
        {
            name: "Profile",
            path: `/officer/profile/${user?._id}`,
            icon: "ri-user-line",
        },
    ];

    const adminMenu = [
        {
            name: "Home",
            path: "/",
            icon: "ri-home-line",
        },
        {
            name: "Users",
            path: "/admin/userslist",
            icon: "ri-user-line",
        },
        {
            name: "Officers",
            path: "/admin/officerslist",
            icon: "ri-user-star-line",
        },
        {
            name: "Profile",
            path: "/profile",
            icon: "ri-user-line",
        },
    ];

    const menuToBeRendered = user?.isAdmin ? adminMenu : user?.isOfficer ? officerMenu : userMenu;
    const role = user?.isAdmin ? "Admin" : user?.isOfficer ? "Officer" : "User";

    return (
        <div className="main">
            <div className='d-flex layout'>
                <div className='sidebar'>
                    <div className="sidebar-header">
                        <h1 className='logo'>Appointment Scheduling System</h1>
                        <h1 className='role'>{role}</h1>
                    </div>

                    <div className='menu'>
                        {menuToBeRendered.map((menu,i) => {
                            const isActive = location.pathname === menu.path;
                            return (
                                <div id ={i}
                                    className={`d-flex menu-item ${
                                        isActive && "active-menu-item"
                                    }`}
                                >
                                    <i className={menu.icon}></i>
                                    {!collapsed && <Link to={menu.path}>{menu.name}</Link>}
                                </div>
                            );
                        })}
                        <div
                            className={`d-flex menu-item`}
                            onClick={() => {
                                localStorage.clear();
                                navigate("/login");
                            }}
                        >
                            <i className="ri-logout-circle-line">logout</i>
                            {!collapsed && <Link to="/login"></Link>}
                        </div>
                    </div>
                </div>

                <div className="content">
                    <div className="header">
                        {collapsed ? (
                            <i
                                className="ri-menu-2-fill header-action-icon"
                                onClick={() => setCollapsed(false)}
                            ></i>
                        ) : (
                            <i
                                className="ri-close-fill header-action-icon"
                                onClick={() => setCollapsed(true)}
                            ></i>
                        )}

                        <div className="d-flex align-items-left px-4">
                            <Badge
                                count={user?.unseenNotifications.length}
                                onClick={() => navigate("/notifications")}
                            >
                                <NotificationOutlined style={{ fontSize: '32px', color: '#005555' ,cursor: 'pointer'}}/>
                            </Badge>
                            
                            <Link className="anchor mx-2" to="/profile">
                                {user?.name}
                            </Link>
                        </div>
                    </div>

                    <div className="body">{children}</div>
                </div>
            </div>
        </div>
    );

}

export default Layout;
