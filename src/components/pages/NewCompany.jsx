import React, { useState } from 'react';
import { TiArrowBackOutline } from "react-icons/ti";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';

function NewCompany() {
    const navigate = useNavigate();
    const [openConfirm, setOpenConfirm] = useState(false);

    const companies = [
        { id: 1, name: 'RN Softwares' },
        { id: 2, name: 'Tech Solutions' },
        { id: 3, name: 'ABC Corp' }
    ];

    // Back button handlers
    const handleBackClick = () => setOpenConfirm(true);
    const handleConfirm = () => {
        setOpenConfirm(false);
        navigate('/new-booking');
    };
    const handleCancel = () => setOpenConfirm(false);

    // Select company and go back with data
    const handleSelectCompany = (companyName) => {
        navigate('/new-booking', { state: { companyName } });
    };

    return (
        <>
            <div className="back-button">
                <button type="button" onClick={handleBackClick}>
                    <TiArrowBackOutline size={44} />
                </button>
                <h1>New Company</h1>
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
                        <input type="text" placeholder='Company Name' name='companyName' autoFocus />
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
                            {companies.map((company, index) => (
                                <tr key={company.id}>
                                    <td>{index + 1}</td>
                                    <td>{company.name}</td>
                                    <td>
                                        <span
                                            className='select'
                                            onClick={() => handleSelectCompany(company.name)}
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

export default NewCompany;
