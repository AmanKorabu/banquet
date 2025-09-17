import React, { useState } from 'react';
import { TiArrowBackOutline } from "react-icons/ti";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';

function Items() {
    const navigate = useNavigate();
    const [openConfirm, setOpenConfirm] = useState(false);

    const functionsList = [
        { id: 1, name: 'ROOMS', rate: "2000.00" },
        { id: 2, name: 'Decorations', rate: "20000.00" },
    ];

    // Back button handlers
    const handleBackClick = () => setOpenConfirm(true);
    const handleConfirm = () => {
        setOpenConfirm(false);
        navigate('/new-booking'); // navigate back safely
    };
    const handleCancel = () => setOpenConfirm(false);

    // ✅ Pass the entire object (item) to NewBooking
    const handleSelectItem = (item) => {
        navigate('/new-booking', { state: { selectedItem: item } });
    };

    return (
        <>
            <div className="back-button">
                <button type="button" onClick={handleBackClick}>
                    <TiArrowBackOutline size={44} />
                </button>
                <h1>Select Items</h1>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={openConfirm} onClose={handleCancel}>
                <DialogTitle>{"Go Back?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to go back? Unsaved changes will be lost.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="primary">Cancel</Button>
                    <Button onClick={handleConfirm} color="error" autoFocus>Yes, Go Back</Button>
                </DialogActions>
            </Dialog>

            <div className='new-party-container'>
                <form>
                    <div className="addNew">
                        <input type="text" placeholder='Function Name' name='functionName' autoFocus />
                        <span>+Add New</span>
                    </div>
                </form>

                <div className="tableList">
                    <table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Name</th>
                                <th>Rate</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {functionsList.map((func, index) => (
                                <tr key={func.id}>
                                    <td>{index + 1}</td>
                                    <td>{func.name}</td>
                                    <td>{func.rate}</td>
                                    <td>
                                        <span
                                            className='select'
                                            onClick={() => handleSelectItem(func)}
                                            style={{ cursor: 'pointer', color: 'blue' }}
                                        >
                                            Select
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Items;
