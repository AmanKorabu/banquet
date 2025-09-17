import React, { useState } from "react";
import dayjs from "dayjs";

function AddNewFunction() {
    const [formData, setFormData] = useState({
        occasion: "",
        guestName: "",
        designation: "",
        instruction: "",
        functionTime: dayjs().format("HH:mm"),
        arrivalTime: dayjs().format("HH:mm"),
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        console.log("Function Details:", formData);
        alert("Function details saved! Check console.");
        // Add API call here if needed
    };

    return (
        <div className="function-form-container">
            <h2>Add Function Details</h2>
            <form onSubmit={handleSave}>
                <label>Occasion / Event Name</label>
                <input
                    type="text"
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleChange}
                    required
                />

                <label>Function Time</label>
                <input
                    type="time"
                    name="functionTime"
                    value={formData.functionTime}
                    onChange={handleChange}
                    required
                />

                <label>Guest Name</label>
                <input
                    type="text"
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleChange}
                    required
                />

                <label>Designation</label>
                <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                />

                <label>Arrival Time</label>
                <input
                    type="time"
                    name="arrivalTime"
                    value={formData.arrivalTime}
                    onChange={handleChange}
                />

                <label>Instructions / Notes</label>
                <textarea
                    name="instruction"
                    value={formData.instruction}
                    onChange={handleChange}
                    rows="4"
                ></textarea>

                <button type="submit">Save</button>
            </form>

            <style>{`
                .function-form-container {
                    max-width: 700px;
                    margin: 40px auto;
                    padding: 20px;
                    border: 1px solid #ccc;
                    border-radius: 10px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    background-color: #fff;
                }

                .function-form-container h2 {
                    text-align: center;
                    margin-bottom: 20px;
                    color: #333;
                }

                form {
                    display: flex;
                    flex-direction: column;
                }

                label {
                    margin-top: 10px;
                    margin-bottom: 5px;
                    font-weight: 500;
                    color: #555;
                    font-size: 20px;
                }

                input, textarea {
                    padding: 8px 12px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 16px;
                    outline: none;
                }

                input:focus, textarea:focus {
                    border-color: #ff00c3ff;
                    box-shadow: 0 0 5px rgba(0,123,255,0.3);
                }

                button {
                    margin: 20px auto;
                    padding: 10px 15px;
                    background-color: #7b0c4bff;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    width: 40%;

                }

                button:hover {
                    background-color: #50253dff;
                }

                @media (max-width: 768px) {
                    .function-form-container {
                        margin: 20px;
                        padding: 15px;
                    }
                }
            `}</style>
        </div>
    );
}

export default AddNewFunction;
