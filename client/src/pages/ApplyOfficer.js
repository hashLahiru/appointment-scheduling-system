import React from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OfficerForm from './../components/OfficerForm';
import moment from "moment";

function ApplyOfficer() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const backendURL = "http://localhost:5000";
    const onFinish = async (values) => {
        try {
            dispatch(showLoading());
            const response = await axios.post(
                `${backendURL}/api/user/apply-officer-account`,
                {
                    ...values,
                    userId: user._id,
                    timings: [
                        moment(values.timings[0]).format("HH:mm"),
                        moment(values.timings[1]).format("HH:mm"),
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                navigate("/");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error("Something went wrong");
        }
    };

    return (
        <Layout>
            <h1 className="page-title"> Apply Officer </h1>
            <hr />
            
            <OfficerForm onFinish={onFinish} />
        </Layout>
    );
}

export default ApplyOfficer;