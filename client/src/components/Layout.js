import React, { useState } from 'react';
import "../layout.css";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "antd";
import { NotificationOutlined } from '@ant-design/icons';
import { clearUser } from "../redux/usersSlice"; 

function Layout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const location = useLocation();
    const userMenu = [
        {
            name: "Home",
            path: "/",
            
        },
        {
            name: "Appointments",
            path: `/appointments`,
            
        },
        {
            name: "Apply Officer",
            path: "/apply-officer",
            
          }
    ];

    const officerMenu = [
        {
            name: "Home",
            path: "/",
            
        },
        
        {
            name: "Appointments",
            path: "/officer/officer-appointments",
            
        },
        {
            name: "Profile",
            path: `/officer/profile/${user?._id}`,
            
        },
    ];

    const adminMenu = [
        {
            name: "Home",
            path: "/",
            
        },
        {
            name: "Users",
            path: "/admin/userslist",
            
        },
        {
            name: "Officers",
            path: "/admin/officerslist",
            
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
                            style={{cursor: "pointer"}}
                            className={`d-flex menu-item`}
                            onClick={() => {
                                localStorage.clear();
                                dispatch(clearUser())
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
                                <NotificationOutlined style={{ fontSize: '32px', color: '#ffffff' ,cursor: 'pointer'}}/>
                            </Badge>
                            
                            <Link className="anchor mx-2"  to="/profile">
                                {user?.name}
                            </Link>
                        </div>
                    </div>

                    <div className="card body">{children}</div>
                </div>
            </div>
        </div>
    );

}

export default Layout;
