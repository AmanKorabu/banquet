
import { HiMiniPlusCircle } from "react-icons/hi2";
import { FcPrint } from "react-icons/fc";
import { FaCalendarDay } from "react-icons/fa6";
import { GiReceiveMoney } from "react-icons/gi";
import { PiCalendarStarFill } from "react-icons/pi";
import { FaWallet } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import '../assets/maindashboard.css'
function MainDashboard() {
    const allEvents = [
        { id: 1, name: "Make Booking", img: <HiMiniPlusCircle size={35} color='gray' />, navigate: '/make-booking' },
        { id: 2, name: "Bills", img: <FcPrint size={35} color='red' />, navigate: '/bills' },
        { id: 3, name: "Calendar View", img: <FaCalendarDay size={35} color='red' />, navigate: '/calendar-view' },
        { id: 4, name: "Unsettled Bills", img: <GiReceiveMoney size={35} color='green' />, navigate: '/unsettled-bills' },
        { id: 5, name: "Upcoming Events", img: <PiCalendarStarFill size={35} color='orange' />, bgcolor: 'rgba(118, 131, 244, 0.44)', color: 'white', navigate: '/upcoming-events' },
        { id: 6, name: "Balance Amount", img: <FaWallet size={40} color='white' />, bgcolor: 'rgba(118, 131, 244, 0.44)', color: 'white', amount: '₹ 50,000', navigate: '/balance-amount' },
    ];
    const navigate = useNavigate();
    const handlePage = (event) => {
        if (navigate) {
            // Navigate to the specified page
            navigate(event.navigate);
        }
    };
    return (
        < >

            <Header />
            <div className="event-container">
                <div className="event-list">
                    {allEvents.map(event => (
                        <div
                            key={event.id}
                            className={`event-item ${event.bgcolor ? 'highlight' : ''}`}
                            onClick={() => handlePage(event)}
                        >
                            <div className="event-img">{event.img}</div>
                            <div className="event-name name">{event.name}
                            </div>
                            {event.amount && <div className="event-amount">{event.amount}</div>}
                        </div>
                    ))}
                </div>

            </div>
        </>
    )
}

export default MainDashboard;
