import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { setUser, clearUser } from "../redux/usersSlice";
import { showLoading, hideLoading } from "../redux/alertsSlice"; 

function ProtectedRoute(props) {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const backendURL = "http://localhost:5000";
    const getUser = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.post(
                `${backendURL}/api/user/get-user-info-by-id`,
                { token: localStorage.getItem("token") },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                dispatch(setUser(response.data.data));
            } else {
                localStorage.clear()
                dispatch(clearUser())
                navigate("/login");
            }
        } catch (error) {
            dispatch(hideLoading());
            localStorage.clear()
            dispatch(clearUser())
            navigate("/login");
        }
    };

    useEffect(() => {
        if (!user) {
            getUser();
        }
    }, [user]);

    if (localStorage.getItem("token")) {
        return props.children;
    } else {
        return <Navigate to = "/login" />
    }
}

export default ProtectedRoute;