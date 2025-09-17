import React, { useState } from 'react';
import { IoSearch } from "react-icons/io5";
import { TiArrowBackOutline } from "react-icons/ti";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';

function NewParty() {
  const navigate = useNavigate();

  // Form state
  const [partyName, setPartyName] = useState({
    partyName: "",
    contactPerson1: "",
    contactPerson2: "",
    email: "",
    address: "",
    zipcode: "",
    country: "",
    city: "",
    state: "",
    alternateContact1: "",
    alternateContact2: "",
    alternateEmail: ""
  });

  // Dialog state
  const [openConfirm, setOpenConfirm] = useState(false);

  // Handle input changes
  const partyNameChange = (e) => {
    const { name, value } = e.target;
    setPartyName(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const HandleParty = (e) => {
    e.preventDefault();

    // 🔹 Get current bookingData from sessionStorage
    const stored = sessionStorage.getItem("bookingData");
    let bookingData = stored ? JSON.parse(stored) : {};

    // 🔹 Merge full party info inside bookingData.customer
    bookingData = {
      ...bookingData,
      customer: {
        ...(bookingData.customer || {}),
        ...partyName,
      },
    };

    // 🔹 Save updated bookingData back
    sessionStorage.setItem("bookingData", JSON.stringify(bookingData));

    console.log("Saved Party:", partyName);
    // 🔹 Navigate back to booking page
    navigate("/new-booking");
  };

  // Back button handlers
  const handleBackClick = () => {
    setOpenConfirm(true);
  };

  const handleConfirm = () => {
    setOpenConfirm(false);
    navigate('/new-booking');
  };

  const handleCancel = () => {
    setOpenConfirm(false);
  };

  return (
    <>
      {/* Back Button */}
      <div className="back-button">
        <button type="button" onClick={handleBackClick}>
          <TiArrowBackOutline size={44} />
        </button>
        <h1>New Party</h1>
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

      {/* Form */}
      <div className='new-party-container'>
        <form onSubmit={HandleParty}>
          <h1>Party Name</h1>
          <div className="partyName">
            <input
              type="text"
              placeholder="Party Name"
              name='partyName'
              value={partyName.partyName}
              onChange={partyNameChange}
              required
              autoFocus
            />
            <div className="search-logo">
              <IoSearch size={40} />
            </div>
          </div>

          <label htmlFor='contact person'>Contact Person</label>
          <div className="numbers">
            <span>+91</span>
            <input
              type="tel"
              placeholder="Contact Person"
              name='contactPerson1'
              value={partyName.contactPerson1}
              onChange={partyNameChange}
              maxLength={10}
              pattern='[0-9]{10}'
            />
          </div>
          <div className="numbers">
            <span>+91</span>
            <input
              type="tel"
              placeholder="Contact Person"
              name='contactPerson2'
              value={partyName.contactPerson2}
              onChange={partyNameChange}
              maxLength={10}
              pattern='[0-9]{10}'
            />
          </div>

          <input
            type="email"
            placeholder="Enter Your Email"
            name='email'
            value={partyName.email}
            onChange={partyNameChange}
          />
          <input
            type="text"
            placeholder="Enter Your Address"
            name='address'
            value={partyName.address}
            onChange={partyNameChange}
          />
          <input
            type="text"
            placeholder="Enter Your Zipcode"
            name='zipcode'
            value={partyName.zipcode}
            onChange={partyNameChange}
          />

          <div className="country-state-city">
            <input type="text" placeholder="Country" name='country' value={partyName.country} onChange={partyNameChange} />
            <input type="text" placeholder="City" name='city' value={partyName.city} onChange={partyNameChange} />
            <input type="text" placeholder="State" name='state' value={partyName.state} onChange={partyNameChange} />
          </div>

          <hr />
          <div className="alternate-contact">
            <h3>Alternate Contact Numbers</h3>
            <div className="numbers">
              <span>+91</span>
              <input
                type="tel"
                placeholder="Alternate Contact"
                name='alternateContact1'
                value={partyName.alternateContact1}
                maxLength={10}
                onChange={partyNameChange}
              />
            </div>
            <div className="numbers">
              <span>+91</span>
              <input
                type="tel"
                placeholder="Alternate Contact"
                name='alternateContact2'
                value={partyName.alternateContact2}
                maxLength={10}
                onChange={partyNameChange}
              />
            </div>
            <input
              type="email"
              name="alternateEmail"
              placeholder='Alternate Email'
              value={partyName.alternateEmail}
              onChange={partyNameChange}
            />
          </div>

          <button type='submit'>Save</button>
        </form>
      </div>
    </>
  );
}

export default NewParty;
