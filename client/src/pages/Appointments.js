import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import Layout from "../components/Layout";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Table } from "antd";
import moment from 'moment';

function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const dispatch = useDispatch();
    const backendURL = "http://localhost:5000";
    const getAppointmentsData = async () => {
        try {
            // dispatch(showLoading());
            const response = await axios.get(`${backendURL}/api/user/get-appointment-by-user-id`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            // dispatch(hideLoading());
            if (response.data.success) {
                setAppointments(response.data.data);
            }
        } catch (error) {
            dispatch(hideLoading());
        }
    };
    const columns = [
        {
            title: "Id",
            dataIndex: "_id",
        },
        {
            title: "Officer",
            dataIndex: "name",
            
        },
        {
            title: "Email",
            dataIndex: "email",
            
        },
        {
            title: "Date & Time",
            dataIndex: "createdAt",
            
        },
        {
            title: "Status",
            dataIndex: "status",
        }
    ];
    
    useEffect(() => {
        getAppointmentsData();
    }, []);

    return <Layout>
        <h1 className="page-title">Appointments</h1>
        <hr />
        <Table columns={columns} dataSource={appointments} />
    </Layout>
}

export default Appointments;