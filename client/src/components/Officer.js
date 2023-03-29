import React from "react";
import { useNavigate } from "react-router-dom";

function Officer({officer}) {
    const navigate = useNavigate();
    return (
        <div 
            className="card p-2 cursor-pointer"
            onClick={() => navigate(`/book-appointment/${officer._id}`)}
        >
            <h1 className="card-title">
                {officer.firstName} {officer.lastName}
            </h1>
            <hr />
            <p>
                <b>Email address : </b>
                {officer.email}
            </p>
            <p>
                <b>Department : </b>
                {officer.department}
            </p>
            <p>
                <b>Service : </b>
                {officer.services}
            </p>
            <p>
                <b>Timings : </b>
                {officer.timings[0]} - {officer.timings[1]}
            </p>
        </div>
    );
};

export default Officer;