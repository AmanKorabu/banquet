import React, { useState, useEffect } from 'react';
import { TiArrowBackOutline } from "react-icons/ti";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function NewCompany() {
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // 🔹 Fetch companies from API using Axios
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const hotelId = localStorage.getItem("hotel_id");
        if (!hotelId) {
          setError("No hotel_id found, please login again");
          return;
        }

        const url = `/banquetapi/search_comp.php`;
        const params = {
          hotel_id: hotelId,
          search_param: search,
        };

        const response = await axios.get(url, { params });
        if (response.status === 200 && Array.isArray(response.data.result)) {
          setCompanies(response.data.result);
          setError(""); // Reset any previous error message
        } else {
          setCompanies([]);
          setError("No companies found");
        }
      } catch (err) {
        console.error("❌ Error fetching companies:", err);
        setError("Failed to fetch companies. Please try again.");
      }
    };

    fetchCompanies();
  }, [search]); // Trigger fetch when the search term changes

  // Back button handlers
  const handleBackClick = () => setOpenConfirm(true);
  const handleConfirm = () => {
    setOpenConfirm(false);
    navigate('/new-booking');
  };
  const handleCancel = () => setOpenConfirm(false);

  // Select company and go back with data
  const handleSelectCompany = (companyName) => {
    let bookingData = {};
    const stored = sessionStorage.getItem("bookingData");
    if (stored) bookingData = JSON.parse(stored);

    bookingData = {
      ...bookingData,
      customer: {
        ...(bookingData.customer || {}),
        companyName: companyName
      },
    };

    sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
    navigate('/new-booking');
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
            <input
              type="text"
              placeholder='Search Company'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            <span>+Add New</span>
          </div>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

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
                <tr key={company.LedgerId}>
                  <td>{index + 1}</td>
                  <td>{company.LedgerName}</td>
                  <td>
                    <span
                      className='select'
                      onClick={() => handleSelectCompany(company.LedgerName)}
                      style={{ cursor: 'pointer', color: 'blue' }}
                    >
                      Select
                    </span>
                  </td>
                </tr>
              ))}
              {companies.length === 0 && !error && (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>No companies found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default NewCompany;
