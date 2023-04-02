import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Col, Row } from "antd";
import Officer from "../components/Officer";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";

function Home() {
    const [officers, setOfficers] = useState([]);
    const dispatch = useDispatch();
    const getData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.get("/api/user/get-all-approved-officers", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            dispatch(hideLoading())
            if (response.data.success) {
                setOfficers(response.data.data);
            }
        } catch (error) {
            dispatch(hideLoading());
        }
    };

    useEffect(() => {
        getData();

    }, []);

    return (
        <Layout>
            <Row gutter={20}>
                {officers.map((officer) => (
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Officer officer={officer} />
                    </Col>
                ))}
            </Row>
        </Layout>
    );
}

export default Home;