const mongoose = require("mongoose");
const appointmentSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        officerId: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: "pending"
        },
    },
    {
        timestamps: true,
    }
);

const appointmentModel = mongoose.model("appointment", appointmentSchema);
module.exports = appointmentModel;