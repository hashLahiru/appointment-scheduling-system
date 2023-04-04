const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Officer = require("../models/officerModel");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/get-all-officers", authMiddleware, async (req, res) => {
    try {
        const officers = await Officer.find({});
        res.status(200).send({
            message: "Officers fetched successfully",
            success: true,
            data: officers,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error applying doctor account",
            success: false,
            error,
        });
    }
});

router.get("/get-all-users", authMiddleware, async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send({
            message: "Users fetched successfully",
            success: true,
            data: users,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error applying officer account",
            success: false,
            error,
        });
    }
});

router.post(
    "/change-officer-account-status",
    authMiddleware,
    async (req, res) => {
        try {
            const { officerId, status } = req.body;
            const officer = await Officer.findByIdAndUpdate(officerId, {
                status,
            });

            const user = await User.findOne({ _id: officer.userId });
            const unseenNotifications = user.unseenNotifications;
            unseenNotifications.push({
                type: "new-officer-request-changed",
                message: `Your office account has been ${status}`,
                onClickPath: "/notifications",
            });
            user.isOfficer = status === "approved" ? true : false;
            await user.save();

            res.status(200).send({
                message: "Officer status updated successfully",
                success: true,
                data: officer,
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

module.exports = router;