import React from 'react'
import Header from '../Header'
import { useNavigate } from 'react-router-dom';

function MakeBooking() {
    const btnContainer = [
        {
            title: 'New Booking',
            url: '/new-booking'
        },
        {
            title: 'Billed Quotations',
            url: '/billed-quotations'
        },
        {
            title: 'View Deleted',
            url: '/view-deleted'
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
                    <button key={index} onClick={() => handleButtonClick(btn.url)}>{btn.title}</button>
                ))}
            </div>
        </>
    )
}

export default MakeBooking
