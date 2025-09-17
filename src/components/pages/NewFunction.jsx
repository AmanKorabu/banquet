import React, { useState } from 'react';
import { TiArrowBackOutline } from "react-icons/ti";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';

function NewFunction() {
    const navigate = useNavigate();
    const [openConfirm, setOpenConfirm] = useState(false);

    const functionsList = [
        { id: 1, name: 'BIRTHDAY' },
        { id: 2, name: 'MARRIAGE' },
        { id: 3, name: 'ENGAGEMENT' },
        { id: 4, name: 'ANNIVERSARY' },
        { id: 5, name: 'CORPORATE MEET' },
        { id: 6, name: 'MINI PARTY' },
        { id: 7, name: 'OTHER' },
        { id: 8, name: 'ROOMS' },
    ];

    // Back button handlers
    const handleBackClick = () => setOpenConfirm(true);
    const handleConfirm = () => {
        setOpenConfirm(false);
        navigate('/new-booking'); // navigate back safely
    };
    const handleCancel = () => setOpenConfirm(false);

    // Select function and go back with data
    const handleSelectFunction = (functionName) => {
        navigate('/new-booking', { state: { functionName } });
    };

    return (
        <>
            <div className="back-button">
                <button type="button" onClick={handleBackClick}>
                    <TiArrowBackOutline size={44} />
                </button>
                <h1>New Function</h1>
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
                        <input type="text" placeholder='Function Name' name='functionName' autoFocus/>
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
                            {functionsList.map((func, index) => (
                                <tr key={func.id}>
                                    <td>{index + 1}</td>
                                    <td>{func.name}</td>
                                    <td>
                                        <span
                                            className='select'
                                            onClick={() => handleSelectFunction(func.name)}
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

export default NewFunction;
