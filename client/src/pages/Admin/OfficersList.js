import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Table } from "antd";
import moment from "moment";


function OfficersList() {
    const [officers, setOfficers] = useState([]);
    const dispatch = useDispatch();
    const getOfficersData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.get("/api/admin/get-all-officers", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            dispatch(hideLoading());
            if (response.data.success) {
                setOfficers(response.data.data);
            }
        } catch (error) {
            dispatch(hideLoading());
        }
    };

    const changeOfficerStatus = async (record, status) => {
        try {
            dispatch(showLoading());
            const response = await axios.post(
                "/api/admin/change-officer-account-status",
                { officerId: record._id, userId: record.userId, status: status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                getOfficersData();
            }
        } catch (error) {
            toast.error('Error changing officer account status');
            dispatch(hideLoading());
        }
    };

    useEffect(() => {
        getOfficersData();
    }, []);

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            render: (text, record) => (
                <span>
                    {record.firstName} {record.lastName}
                </span>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            render: (record, text) => moment(record?.createdAt).format("DD-MM-YYYY"),
        },
        {
            title: "Status",
            dataIndex: "status",
        },
        {
            title: 'Department',
            dataIndex: "department",
        },
        {
            title: "Position",
            dataIndex: "position",
        },
        {
            title: "Services",
            dataIndex: "services"
        },
        {
            title: "Actions",
            dataIndex: "actions",
            render: (text, record) => (
                <div className='d-flex'>
                    {record.status === "pending" && (
                        <h1
                            className='anchor'
                            onClick={() => changeOfficerStatus(record, "approved")}
                        >
                            Approve
                        </h1>
                    )}
                    {record.status === "approved" && (
                        <h1
                            className='anchor'
                            onClick={() => changeOfficerStatus(record, "blocked")}
                        >
                            Block
                        </h1>
                    )}
                </div>
            ),
        },
    ];

    return (
        <Layout>
            <h1 className="page-header">Officers List</h1>
            <hr />
            <Table columns={columns} dataSource={officers} />
        </Layout>
    );
}

export default OfficersList;
