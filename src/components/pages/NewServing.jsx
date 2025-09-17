import React, { useState } from 'react';
import { TiArrowBackOutline } from "react-icons/ti";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';

function NewServing() {
    const navigate = useNavigate();
    const [openConfirm, setOpenConfirm] = useState(false);

    const servingList = [
        { id: 1, name: 'SWEETS & SNACKS' },
        { id: 2, name: 'BEVERAGES' },
        { id: 3, name: 'MAIN COURSE' },
        { id: 4, name: 'APPETIZERS' },
        { id: 5, name: 'DESSERTS' },
        { id: 6, name: 'OTHER' },
    ];

    // Back button handlers
    const handleBackClick = () => setOpenConfirm(true);
    const handleConfirm = () => {
        setOpenConfirm(false);
        navigate('/new-booking'); // navigate back safely without selecting
    };
    const handleCancel = () => setOpenConfirm(false);

    // Select serving and go back with data
    const handleSelectServing = (servingName) => {
        navigate('/new-booking', { state: { servingData: { servingName } } });
    };

    return (
        <>
            <div className="back-button">
                <button type="button" onClick={handleBackClick}>
                    <TiArrowBackOutline size={44} />
                </button>
                <h1>New Serving</h1>
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
                        <input type="text" placeholder='Serving Name' name='servingName' autoFocus />
                        <span>+Add New</span>
                    </div>
                </form>

                <div className="tableList">
                    <table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {servingList.map((serving, index) => (
                                <tr key={serving.id}>
                                    <td>{index + 1}</td>
                                    <td>{serving.name}</td>
                                    <td>
                                        <span
                                            className='select'
                                            onClick={() => handleSelectServing(serving.name)}
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

export default NewServing;
