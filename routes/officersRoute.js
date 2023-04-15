const express = require("express");
const router = express.Router();
const Officer = require("../models/officerModel");
const authMiddleware = require("../middlewares/authMiddleware");
const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");
const { stat } = require("fs");

router.post("/get-officer-info-by-user-id", authMiddleware, async (req, res) => {
    try {
        const officer = await Officer.findOne({ userId: req.body.userId });
        res.status(200).send({
            success: true,
            message: "Officer info fetched successfully",
            data: officer,
        });
    } catch (error) {
        res
            .status(500)
            .send({ message: "Error getting Officer info", success: false, error });
    }
});
//  /api/officer/update-officer-profile
router.post("/get-offcer-info-by-id", authMiddleware, async (req, res) => {
    try {
        const officer = await Officer.findOne({ _id: req.body.officerId });
        res.status(200).send({
            success: true,
            message: "Officer info fetched successfully",
            data: officer,
        });
    } catch (error) {
        res
            .status(500)
            .send({ message: "Error getting officer info", success: false, error });
    }
});

router.post("/update-officer-profile", authMiddleware, async (req, res) => {
    try {
        const officer = await officer.findOneAndUpdate(
            { userId: req.body.userId },
            req.body
        );
        res.status(200).send({
            success: true,
            message: "Officer profile updated successfully",
            data: officer,
        });
    } catch (error) {
        res
            .status(500)
            .send({ message: "Error getting officer info", success: false, error });
    }
});

router.get(
    "/get-appointments-by-officer-id",
    authMiddleware,
    async (req, res) => {
        try {
            const officer = await Officer.findOne({ userId: req.body.userId });
            console.log(officer)
            const appointments = await Appointment.find({ officerId: officer._id });
            res.status(200).send({
                message: "Appointments fetched successfully",
                success: true,
                data: appointments,
            });
        } catch (error) {
            console.log(error);
            res.statusMessage(500).send({
                message: "Error fetching appointments",
                success: false,
                error,
            });
        }
    }
);

router.post("/change-appointment-status", authMiddleware, async (req, res) => {
    try {
        const { appointmentId, status } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(appointmentId, {
            status,
        });

        const user = await User.findOne({ _id: appointment.userId });
        const unseenNotifications = user.unseenNotifications;
        unseenNotifications.push({
            type: "appointment-status-changed",
            message: `Your appointment status has been ${status}`,
            onClickPath: "/appointments",
        });

        await user.save();

        res.status(200).send({
            message: "Appointment status updated successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error changing appointment status",
            success: false,
            error,
        });
    }
});

module.exports = router;