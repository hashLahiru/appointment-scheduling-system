import { Button, Col, Form, Input, Row, TimePicker } from "antd";
import moment from "moment";
import React from "react";

function OfficerForm({onFinish, initivalValues}) { 
    return (
        <Form
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
                ...initivalValues,
                ...(initivalValues && {
                    timings: [
                        moment(initivalValues?.timings[0], "HH:mm"),
                        moment(initivalValues?.timings[1], "HH:mm"),
                    ],
                }),
            }}
        >
            <h1 className="card-title mt-3">Personal Information</h1>
            <Row gutter={20}>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item
                        required
                        label="First Name"
                        name="firstName"
                        rules={[{required:true}]}
                    >
                        <Input placeholder="First Name"/>
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item
                        required
                        label="Last Name"
                        name="lastName"
                        rules={[{required:true}]}
                    >
                        <Input placeholder="Last Name"/>
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item
                        required
                        label="Phone Number"
                        name="phoneNumber"
                        rules={[{required:true}]}
                    >
                        <Input placeholder="Phone Number"/>
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item
                        required
                        label="Email"
                        name="email"
                        rules={[{required:true}]}
                    >
                        <Input placeholder="Email"/>
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item
                        required
                        label="Address"
                        name="address"
                        rules={[{required:true}]}
                    >
                        <Input placeholder="Address"/>
                    </Form.Item>
                </Col>
            </Row>
            <hr />
            <h1 className="card-title mt-3">Professional Information</h1>
            <Row gutter={20}>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item
                        required
                        label="Department"
                        name="department"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Department"/>
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item
                        required
                        label="Position"
                        name="position"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Position"/>
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item
                        required
                        label="Services"
                        name="services"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Services"/>
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item
                        required
                        label="Timings"
                        name="timings"
                        rules={[{ required: true }]}
                    >
                        <TimePicker.RangePicker
                        format="HH:mm"
                        value={
                            initivalValues && initivalValues.timings
                            ? [
                                moment(initivalValues.timings[0], "HH:mm"),
                                moment(initivalValues.timings[1], "HH:mm"),
                                ]
                            : undefined
                        }
                        />
                    </Form.Item>
                </Col>
            </Row>

            <div className="d-flex justify-content-end">
                <Button className="primary-button" htmlType="submit">
                    SUBMIT
                </Button>
            </div>
        </Form>
    );
};

export default OfficerForm;