import React from 'react'
import Header from '../Header'
import { useNavigate } from 'react-router-dom';

function MakeBooking() {
    const btnContainer = [
        {
            title: 'New Booking',
            url: '/new-booking',
            style: { backgroundColor: '#2b2c3eff' },
        },

        {
            title: 'Billed Quotations',
            url: '/billed-quotations',
            style: { backgroundColor: '#2b2c3eff' },
        },
        {
            title: 'View Deleted',
            url: '/view-deleted',
            style: { backgroundColor: '#2b2c3eff' }
        }
    ]
    const navigate = useNavigate();

    const handleButtonClick = (url) => {
        // Navigate to the selected URL
        navigate(url);
    };
    return (
        <>
            <Header />
            <div className="buttonContainer">
                {btnContainer.map((btn, index) => (
                    <button key={index} onClick={() => handleButtonClick(btn.url)} style={btn.style}>{btn.title}</button>
                ))}
            </div>
        </>
    )
}

export default MakeBooking
