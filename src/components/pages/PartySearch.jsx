import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { TiArrowBackOutline } from "react-icons/ti";
import axios from "axios";

function PartySearch() {
  const [parties, setParties] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);

  // Back button handlers
  const handleBackClick = () => setOpenConfirm(true);
  const handleConfirm = () => {
    setOpenConfirm(false);
    navigate("/new-party");
  };
  const handleCancel = () => setOpenConfirm(false);

  // Fetch parties based on search term using axios.post
  useEffect(() => {
    const fetchParties = async () => {

      try {
        const hotelId = localStorage.getItem("hotel_id");
        if (!hotelId) {
          setError("No hotel_id found, please login again");
          return;
        }

        // Using axios.post to get the parties
        const response = await axios.post("/banquetapi/search_cust_exp.php", null, {
          params: {
            hotel_id: hotelId,
            search_param: search, // Pass the search term as a parameter
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // Ensure correct content type
          },
          
        });

        if (response.status === 200 && Array.isArray(response.data.result)) {
          setParties(response.data.result);
          setError(""); // Reset error if data is found
        } else {
          setParties(response.data.result || []);
          setError("No results found");
        }
      } catch (err) {
        console.error("❌ Error fetching parties:", err);
        setError("Failed to fetch parties. Please try again.");
      }
    };

    fetchParties();
  }, [search]); // Trigger fetching parties when search term changes
  // Trigger fetching parties when search term changes

  // Handle party selection
  const handleSelect = (party) => {
    // Save selected party to sessionStorage and navigate
    sessionStorage.setItem("selectedParty", JSON.stringify(party));
    navigate("/new-party");
  };

  return (
    <>
      <div className="back-button">
        <button type="button" onClick={handleBackClick}>
          <TiArrowBackOutline size={44} />
        </button>
        <h1>Search Party</h1>
      </div>

      {/* Confirm dialog when user wants to go back */}
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

      {/* Search input and results */}
      <div style={{ padding: "20px", position: "relative", top: "60px" }}>
        <input
          type="text"
          placeholder="Search by name or mobile"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "20px" }}
          autoFocus
        />

        {/* Show error message if any */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* List parties */}
        <ul>
          {parties.map((p) => (
            <li
              key={p.LedgerId}
              style={{
                marginBottom: "10px",
                borderBottom: "1px solid #ccc",
                padding: "5px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{p.LedgerName}</span>
              <span onClick={() => handleSelect(p)} style={{ cursor: "pointer", color: "blue" }}>Select</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default PartySearch;
