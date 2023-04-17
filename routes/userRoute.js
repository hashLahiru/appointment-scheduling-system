const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Officer = require("../models/officerModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const Appointment = require("../models/appointmentModel");
const moment = require("moment");

router.post("/register", async (req, res) => {
    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res
                .status(200)
                .send({ message: "User Already exists", success: false });
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const newuser = new User(req.body);
        await newuser.save();
        res
            .status(200)
            .send({ message: "User created successfully", success: true });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .send({ message: "Error creating user", success: false, error });
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res
                .status(200)
                .send({ message: "User does not exist", success: false });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res
                .status(200)
                .send({ message: "Password is incorrect", success: false });
        } else {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });
            console.log()
            res
                .status(200)
                .send({ message: "Login successful", success: true, data: token });
        }
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .send({ message: "Error logging in", success: false, error });
    }
});

router.post("/get-user-info-by-id", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        if (!user) {
            return res
                .status(200)
                .send({ message: "User does not exist", success: false });
        } else {
            user.password = undefined;
            res.status(200).send({
                success: true,
                data: user,
            });
        }
    } catch (error) {
        res
            .status(500)
            .send({ message: "Error getting user info", success: false, error });
    }
});

router.post("/apply-officer-account", authMiddleware, async (req, res) => {
    try {
        const newOfficer = new Officer({ ...req.body, status: "pending" });
        await newOfficer.save();
        const adminUser = await User.findOne({ isAdmin: true });

        const unseenNotifications = adminUser.unseenNotifications;
        unseenNotifications.push({
            type: "new-officer-request",
            message: `${newOfficer.firstName} ${newOfficer.lastName} has applied for a officer account`,
            data: {
                officerId: newOfficer._id,
                name: newOfficer.firstName + " " + newOfficer.lastName,
            },
            onClickPath: "/admin/officerslist",
        });
        await User.findByIdAndUpdate(adminUser._id, { unseenNotifications });
        res.status(200).send({
            success: true,
            message: "Officer account applied successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error applying officer account",
            success:false,
            error,
        });
    }
});

router.post(
    "/mark-all-notifications-as-seen",
    authMiddleware,
    async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.body.userId });
            const unseenNotifications = user.unseenNotifications;
            const seenNotifications = user.seenNotifications;
            seenNotifications.push(...unseenNotifications);
            user.unseenNotifications = [];
            user.seenNotifications = seenNotifications;
            const updateUser = await user.save();
            updateUser.password = undefined;
            res.status(200).send({
                success: true,
                message: "All notifications marked as seen",
                data: updateUser,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: "Error applying officer account",
                success: false,
                error,
            });
        }
    }
);

router.post("/delete-all-notifications", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        user.seenNotifications = [];
        user.unseenNotifications = [];
        const updateUser = await user.save();
        updateUser.password = undefined;
        res.status(200).send({
            success: true,
            message: "All notifications cleared",
            data: updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error applying officer account",
            success: false,
            error,
        })
    }
});

router.get("/get-all-approved-officers", authMiddleware, async (req, res) => {
    try {
        const officers = await Officer.find({ status: "approved" });
        console.log(officers)
        res.status(200).send({
            message: "Officers fetched successfully",
            success: true,
            data: officers,
        });
    } catch (error) {
        res.status(500).send({
            message: "Error applying officer account",
            success: false,
            error,
        });
    }
});

router.post("/book-appointment", authMiddleware, async (req, res) => {
    try {
        req.body.status = "pending";
        req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
        req.body.time = moment(req.body.time, "HH:mm").toISOString();
        const newAppointment = new Appointment(req.body);
        await newAppointment.save();

        //pushing notification to officer based on his userId
        const user = await User.findOne({ _id: req.body.userId });
        // user.unseenNotifications.push({
        //     type: "new-appointment-request",
        //     message: `A new appointment request has been made by ${req.body.userInfo.name}`,
        //     onClickPath: "/officer/appointment",
        // });
        // await user.save();
        res.status(200).send({
            message: "Appointment booked successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error booking appointment",
            success: false,
            error,
        });
    }
});

router.post("/check-booking-availability", authMiddleware, async (req, res) => {
    try {
        const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
        const fromTime = moment(req.body.time, "HH:mm")
            .substract(1, "hours")
            .toISOString();
        const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
        const officerId = req.body.officerId;
        const appointments = await Appointment.find({
            officerId,
            date,
            time: { $gte: fromTime, $lte: toTime },
        });
        if (appointments.length > 0) {
            return res.status(200).send({
                message: "Appointments not availabale",
                success: false,
            });
        } else {
            return res.status(200).send({
                message: "Appointments available",
                success: true,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error booking appointment",
            success: false,
            error,
        });
    }
});

router.get("/get-appointment-by-user-id", authMiddleware, async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.body.userId });
        res.status(200).send({
            message: "Appointments fetched successfully",
            success: true,
            data: appointments,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error fetching appointments",
            success: false,
            error,
        });
    }
});

module.exports = router;