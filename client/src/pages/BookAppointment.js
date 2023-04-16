import { Button, Col, DatePicker, Form, Input, Row, TimePicker } from "antd";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import moment from "moment";

function BookAppointment() {
    const [isAvailable, setIsAvailable] = useState(false);
    const navigate = useNavigate();
    const [date, setDate] = useState();
    const [time, setTime] = useState();
    const { user } = useSelector((state) => state.user);
    const [officer, setOfficer] = useState(null);
    const params = useParams();
    const dipatch = useDispatch();
    const backendURL = "http://localhost:5000";
    const getOfficerData = async () => {
        try {
            // dispatchEvent(showLoading());
            const response = await axios.post(
                `${backendURL}/api/officer/get-offcer-info-by-id`,
                {
                    officerId: params.officerId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            // dispatchEvent(hideLoading());
            if (response.data.success) {
                console.log(response.data.data)
                console.log(user)
                setOfficer(response.data.data);
            }
        } catch (error) {
            console.log(error);
            dispatchEvent(hideLoading());
        }
    };

    const checkAvailability = async () => {
        try {
            dispatchEvent(showLoading());
            const response = await axios.post(
                `${backendURL}/api/user/check-booking-availability`,
                {
                    officerId: params.officerId,
                    date: date,
                    time: time,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            dispatchEvent(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                setIsAvailable(true);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error booking appointment");
            dipatch(hideLoading());
        }
    };

    const bookNow = async () => {
        setIsAvailable(false);
        try {
            // dispatchEvent(showLoading());
            const response = await axios.post(
                `${backendURL}/api/user/book-appointment`,
                {
                    "officerId": params.officerId,
                    "userId": user._id,
                   
                    "date": date,
                    "time": time,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            // dispatchEvent(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/appointments')
            }
        } catch (error) {
            toast.error("Error booking appointment");
            dipatch(hideLoading());
        }
    };

    useEffect(() => {
        getOfficerData();
    }, []);

    return (
        <Layout>
            {officer && (
                <div>
                    <h1 className="page-title">
                        {officer.firstName} {officer.lastName}
                    </h1>
                    <hr />
                    <Row gutter={20} className="mt-5" align="middle">
                        <Col span={8} sm={24} xs={24} lg={8}>
                            <img
                                src=""
                                alt=""
                                width="100%"
                                height='400'
                            />
                        </Col>
                        <Col span={8} sm={24} xs={24} lg={8}>
                            <h1 className="normal-text">
                                <b>Timings :</b> {officer.timings[0]} - {officer.timings[1]}
                            </h1>

                            <p>
                                <b>Email :</b>
                                {officer.email}
                            </p>
                            <p>
                                <b>Address :</b>
                                {officer.address}
                            </p>
                            <p>
                                <p>Department :</p>
                                {officer.department}
                            </p>
                            <p>
                                <b>Service :</b>
                                {officer.services}
                            </p>
                            <div className="d-flex flex-column pt-2 mt-2">
                                <DatePicker
                                    format="DD-MM-YYYY"
                                    onChange={(value) => {
                                        setDate(moment(value).format("DD-MM-YYYY"));
                                        setIsAvailable(false);
                                    }}
                                />
                                <TimePicker
                                    format="HH:mm"
                                    className="mt-3"
                                    onChange={(value) => {
                                        setIsAvailable(false);
                                        setTime(moment(value).format("HH:mm"));
                                    }}
                                />
                                {isAvailable && <Button
                                    className="primary-button mt-3  full-width-button"
                                    onClick={checkAvailability}
                                >
                                    Check Availability
                                </Button>}

                                {!isAvailable && (
                                    <Button
                                        className="primary-button mt-3 full-width-button"
                                        onClick={bookNow}
                                    >
                                        Book Now
                                    </Button>
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>
            )}
        </Layout>
    );
}

export default BookAppointment;