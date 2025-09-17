import React, { useState, useEffect, useRef } from "react";
import { TiArrowBackOutline } from "react-icons/ti";
import { AiFillEdit } from "react-icons/ai";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from "@mui/material";
function NewBooking() {
    const navigate = useNavigate();
    const location = useLocation();

    // 🔒 Fixed tax config
    const FIXED_TAX_NAME = "GST";   // <- fixed
    const FIXED_TAX_PERCENT = 18;    // <- fixed

    const [billingCompanies, setBillingCompanies] = useState([]);
    const [attendees, setAttendees] = useState([]);
    const [statuses, setStatuses] = useState([]);



    const venues = ["ALL", "HALL", "MINI HALL", "GARDEN", "AC HALL", "CONFERENCE HALL"];

    const defaultItem = {
        itemDate: dayjs(),
        itemName: "",
        quantity: "1",
        rate: "",
        description: "",
        discount: "", // only editable in table
    };
    const entryDateRef = useRef(null);
    const entryTimeRef = useRef(null);
    const billingCompanyRef = useRef(null);
    const attendedByRef = useRef(null);
    const statusRef = useRef(null);
    const partyNameRef = useRef(null);
    const companyNameRef = useRef(null);
    const functionNameRef = useRef(null);
    const venueRef = useRef(null);
    const minPeopleRef = useRef(null);
    const maxPeopleRef = useRef(null);

    const defaultBookingData = {
        entryDate: null,   // ✅ will be set by API
        entryTime: null,   // ✅ will be set by API
        bookingFromDate: null,
        bookingFromTime: null,
        bookingToDate: null,
        bookingToTime: null,
        billingCompany: "",
        attendedBy: "",
        status: "",
        customer: {
            partyName: "",
            companyName: "",
            functionName: "",
            email: "",
            phone: "",
        },
        eventDetails: {
            venue: "",
            servingName: "",
            servingAddress: "",
            minPeople: "",
            maxPeople: "",
        },
        // IMPORTANT: array of items
        itemDetails: [],
    };


    // ---- State ---------------------------------------------------------------
    const [bookingData, setBookingData] = useState(() => {
        const saved = sessionStorage.getItem("bookingData");
        if (saved) {
            const parsed = JSON.parse(saved);
            return {
                ...defaultBookingData,
                ...parsed,
                entryDate: parsed.entryDate ? dayjs(parsed.entryDate) : dayjs(),
                entryTime: parsed.entryTime ? dayjs(parsed.entryTime) : dayjs(),
                bookingFromDate: parsed.bookingFromDate ? dayjs(parsed.bookingFromDate) : dayjs(),
                bookingFromTime: parsed.bookingFromTime ? dayjs(parsed.bookingFromTime) : dayjs(),
                bookingToDate: parsed.bookingToDate ? dayjs(parsed.bookingToDate) : dayjs(),
                bookingToTime: parsed.bookingToTime ? dayjs(parsed.bookingToTime) : dayjs(),
                customer: { ...defaultBookingData.customer, ...parsed.customer },
                eventDetails: { ...defaultBookingData.eventDetails, ...parsed.eventDetails },
                itemDetails: Array.isArray(parsed.itemDetails)
                    ? parsed.itemDetails.map((item) => ({
                        ...item,
                        itemDate: item.itemDate ? dayjs(item.itemDate) : dayjs(),
                        discount: Number(item.discount || 0),
                    }))
                    : [],
            };
        }
        return defaultBookingData;
    });
    // When entryDate changes → set bookingFromDate & bookingToDate
    useEffect(() => {
        if (bookingData.entryDate) {
            setBookingData((prev) => ({
                ...prev,
                bookingFromDate: bookingData.entryDate,
                bookingToDate: bookingData.entryDate,
            }));
        }
    }, [bookingData.entryDate]);

    // When entryTime changes → set bookingFromTime & bookingToTime
    useEffect(() => {
        if (bookingData.entryTime) {
            setBookingData((prev) => ({
                ...prev,
                bookingFromTime: bookingData.entryTime,
                bookingToTime: bookingData.entryTime,
            }));
        }
    }, [bookingData.entryTime]);


    // holds the currently edited line before pressing ADD
    const [currentItem, setCurrentItem] = useState(defaultItem);
    const [editingIndex, setEditingIndex] = useState(null); // null means we are adding new

    // ---- Effects -------------------------------------------------------------
    // Update when coming back with state from other pages

    useEffect(() => {
        if (!location.state) return;
        const servingData = location.state.servingData || {};

        // If user returned from Items page with a selected item, apply to currentItem
        const selectedItemName = location.state.selectedItem?.name;
        const selectedItemRate = location.state.selectedItem?.rate;

        setCurrentItem((prev) => ({
            ...prev,
            itemName: selectedItemName ?? prev.itemName,
            rate: selectedItemRate ?? prev.rate,
            itemDate: location.state.itemDate ? dayjs(location.state.itemDate) : prev.itemDate,
        }));

        // Merge other customer/event fields into bookingData/
        setBookingData((prev) => ({
            ...prev,
            customer: {
                ...prev.customer,
                partyName:
                    location.state.partyName ||
                    location.state.bookingData?.customer?.partyName ||
                    prev.customer.partyName,
                companyName:
                    location.state.companyName ||
                    location.state.bookingData?.customer?.companyName ||
                    prev.customer.companyName,
                functionName:
                    location.state.functionName ||
                    location.state.bookingData?.customer?.functionName ||
                    prev.customer.functionName,
            },
            eventDetails: {
                ...prev.eventDetails,
                servingName: servingData.servingName || prev.eventDetails.servingName,
                servingAddress: servingData.servingAddress || prev.eventDetails.servingAddress,
                minPeople: servingData.minPeople || prev.eventDetails.minPeople,
                maxPeople: servingData.maxPeople || prev.eventDetails.maxPeople,
            },
        }));
    }, [location.state]);

    useEffect(() => {
        sessionStorage.setItem(
            "bookingData",
            JSON.stringify({
                ...bookingData,
                entryDate: bookingData.entryDate ? bookingData.entryDate.toISOString() : null,
                entryTime: bookingData.entryTime ? bookingData.entryTime.toISOString() : null,
                bookingFromDate: bookingData.bookingFromDate ? bookingData.bookingFromDate.toISOString() : null,
                bookingFromTime: bookingData.bookingFromTime ? bookingData.bookingFromTime.toISOString() : null,
                bookingToDate: bookingData.bookingToDate ? bookingData.bookingToDate.toISOString() : null,
                bookingToTime: bookingData.bookingToTime ? bookingData.bookingToTime.toISOString() : null,

                itemDetails: bookingData.itemDetails.map((item) => ({
                    ...item,
                    itemDate: item.itemDate ? item.itemDate.toISOString() : null,
                    discount: Number(item.discount || 0),
                })),
            })
        );
    }, [bookingData]);

    // ---- UI Handlers --------------------------------------------------------
    const [openConfirm, setOpenConfirm] = useState(false);
    const handleBackClick = () => setOpenConfirm(true);
    const handleConfirm = () => {
        sessionStorage.setItem("scrollPosition", window.scrollY.toString()); // save before leaving
        setOpenConfirm(false);
        navigate("/make-booking", { state: { bookingData } });
    };

    const handleCancel = () => setOpenConfirm(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "eventDetails" || name === "venue") {
            setBookingData((prev) => ({
                ...prev,
                eventDetails: { ...prev.eventDetails, venue: value },
            }));
        } else if (name === "servingAddress") {
            setBookingData((prev) => ({
                ...prev,
                eventDetails: { ...prev.eventDetails, servingAddress: value },
            }));
        } else if (name === "minPeople" || name === "maxPeople") {
            setBookingData((prev) => ({
                ...prev,
                eventDetails: { ...prev.eventDetails, [name]: value },
            }));
        } else {
            setBookingData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleDateChange = (name, value) => {
        setBookingData((prev) => ({ ...prev, [name]: value }));
    };

    const handleItemPage = () => {
        sessionStorage.setItem("scrollPosition", window.scrollY.toString());
        navigate("/items", { state: { bookingData, currentItemName: currentItem.itemName } });
    };

    const handleServingNames = () => {
        sessionStorage.setItem("scrollPosition", window.scrollY.toString());
        navigate("/serving-names", {
            state: { bookingData, currentServingName: bookingData.eventDetails.servingName },
        });
    };

    const handleNewParty = () => {
        sessionStorage.setItem("scrollPosition", window.scrollY.toString());
        navigate("/new-party", {
            state: { bookingData, currentPartyName: bookingData.customer.partyName },
        });
    };

    const handleNewCompany = () => {
        sessionStorage.setItem("scrollPosition", window.scrollY.toString());
        navigate("/new-company", {
            state: { bookingData, currentCompanyName: bookingData.customer.companyName },
        });
    };

    const handleNewFunction = () => {
        sessionStorage.setItem("scrollPosition", window.scrollY.toString());
        navigate("/new-function", {
            state: { bookingData, currentFunctionName: bookingData.customer.functionName },
        });
    };

    const addNewFunction = (e) => {
        e.stopPropagation();
        e.preventDefault();
        sessionStorage.setItem("scrollPosition", window.scrollY.toString());
        navigate("/add-function", { state: { bookingData } });
    };

    // Items: add / delete / modify -------------------------------------------
    const handleAddItem = () => {
        if (!currentItem.itemName) {
            toast.error("Please select an item before adding! ❌", { toastId: "item-error" }); return;
        }

        setBookingData((prev) => {
            const updatedItems = [...prev.itemDetails];

            if (editingIndex !== null) {
                updatedItems[editingIndex] = {
                    ...currentItem,
                    quantity: Number(currentItem.quantity || 0),
                    rate: Number(currentItem.rate || 0),
                };
                toast.success("Item updated successfully! ✅", { toastId: "item-updated" });
            } else {
                updatedItems.push({
                    ...currentItem,
                    quantity: Number(currentItem.quantity || 0),
                    rate: Number(currentItem.rate || 0),
                });
                toast.success("Item added successfully! 🎉", { toastId: "item-added" });
            }

            return { ...prev, itemDetails: updatedItems };
        });

        setCurrentItem(defaultItem);
        setEditingIndex(null);
    };
    const handleDeleteItem = (index) => {
        setBookingData((prev) => ({
            ...prev,
            itemDetails: prev.itemDetails.filter((_, i) => i !== index),
        }));
        if (editingIndex === index) {
            setEditingIndex(null);
            setCurrentItem(defaultItem);
        }
    };
    // only Discount is editable in table
    const handleRowDiscountChange = (index, value) => {
        const raw = Number(value);
        setBookingData((prev) => {
            const items = [...prev.itemDetails];
            const item = { ...items[index] };
            const amount = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
            let discount = isNaN(raw) ? 0 : raw;
            if (discount < 0) discount = 0;
            if (discount > amount) discount = amount; // clamp
            item.discount = discount;
            items[index] = item;
            return { ...prev, itemDetails: items };
        });
    };
    // Submit ------------------------------------------------------------------
    // inside NewBooking component...

    // Submit ------------------------------------------------------------------
    const handleSubmit = (e) => {
        if (e?.preventDefault) e.preventDefault();

        const safeFormat = (date, formatStr) =>
            date && dayjs(date).isValid() ? dayjs(date).format(formatStr) : "";


        const formattedData = {
            ...bookingData,
            entryDate: safeFormat(bookingData.entryDate, "DD-MM-YYYY"),
            entryTime: safeFormat(bookingData.entryTime, "hh:mm A"),
            bookingFromDate: safeFormat(bookingData.bookingFromDate, "DD-MM-YYYY"),
            bookingFromTime: safeFormat(bookingData.bookingFromTime, "hh:mm A"),
            bookingToDate: safeFormat(bookingData.bookingToDate, "DD-MM-YYYY"),
            bookingToTime: safeFormat(bookingData.bookingToTime, "hh:mm A"),
            customer: { ...bookingData.customer },
            eventDetails: { ...bookingData.eventDetails },
            itemDetails: bookingData.itemDetails.map((it) => {
                const qty = Number(it.quantity) || 0;
                const rate = Number(it.rate) || 0;
                const amount = qty * rate;
                const discount = Number(it.discount || 0);
                const taxable = Math.max(0, amount - discount);
                const taxAmt = (taxable * FIXED_TAX_PERCENT) / 100;
                const total = taxable + taxAmt;

                return {
                    ...it,
                    itemDate: safeFormat(it.itemDate, "DD-MM-YYYY"),
                    amount,
                    discount,
                    taxable,
                    taxName: FIXED_TAX_NAME,
                    taxPercent: FIXED_TAX_PERCENT,
                    taxAmt,
                    total,
                };
            }),
        };

        console.log("Booking Data:", formattedData); // ✅ now always logs
        toast.success("Booking saved successfully! ✅", { toastId: "booking-saved" });
        sessionStorage.removeItem("bookingData");
    };

    // handle save or submit with dialog boxes
    const [openSaveConfirm, setOpenSaveConfirm] = useState(false);

    const handleSaveClick = () => {
        if (!validateForm()) return;
        setOpenSaveConfirm(true);
    };

    // when user confirms → call handleSubmit()
    const handleSaveConfirm = () => {
        setOpenSaveConfirm(false);
        handleSubmit(); // ✅ trigger submit + log booking data
        navigate("/dashboard");
    };

    const handleSaveCancel = () => {
        setOpenSaveConfirm(false);
    };


    // handle save or submit with dialog boxes

    // 🔍 Validate before showing dialog
    // 🔍 Validate before showing dialog
    const validateForm = () => {
        if (!bookingData.entryDate) {
            toast.error("⚠️ Please select Entry Date");
            entryDateRef.current?.focus();
            return false;
        }
        if (!bookingData.entryTime) {
            toast.error("⚠️ Please select Entry Time");
            entryTimeRef.current?.focus();
            return false;
        }
        if (!bookingData.billingCompany) {
            toast.error("⚠️ Please select Billing Company");
            billingCompanyRef.current?.focus();
            return false;
        }
        if (!bookingData.attendedBy) {
            toast.error("⚠️ Please select Attended By");
            attendedByRef.current?.focus();
            return false;
        }
        if (!bookingData.status) {
            toast.error("⚠️ Please select Status");
            statusRef.current?.focus();
            return false;
        }
        if (!bookingData.customer.partyName) {
            toast.error("⚠️ Please enter Party Name");
            partyNameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            partyNameRef.current?.focus();
            return false;
        }
        if (!bookingData.customer.companyName) {
            toast.error("⚠️ Please enter Company Name");
            companyNameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            companyNameRef.current?.focus();
            return false;
        }
        if (!bookingData.customer.functionName) {
            toast.error("⚠️ Please enter Function Name");
            functionNameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            functionNameRef.current?.focus();
            return false;
        }
        if (!bookingData.eventDetails.venue) {
            toast.error("⚠️ Please select Venue");
            venueRef.current?.focus();
            return false;
        }
        if (!bookingData.eventDetails.minPeople) {
            toast.error("⚠️ Please enter Min Pax");
            minPeopleRef.current?.focus();
            return false;
        }
        if (!bookingData.eventDetails.maxPeople) {
            toast.error("⚠️ Please enter Max Pax");
            maxPeopleRef.current?.focus();
            return false;
        }

        // ✅ Item Details required
        if (bookingData.itemDetails.length === 0) {
            toast.error("⚠️ Please add at least one Item");
            document.querySelector(".item-details-container")?.scrollIntoView({ behavior: "smooth", block: "center" });
            return false;
        }

        for (let i = 0; i < bookingData.itemDetails.length; i++) {
            const item = bookingData.itemDetails[i];
            if (!item.itemName) {
                toast.error(`⚠️ Item Name required in Row ${i + 1}`);
                document.querySelector(".item-details-container")?.scrollIntoView({ behavior: "smooth", block: "center" });
                return false;
            }
            if (!item.quantity) {
                toast.error(`⚠️ Quantity required in Row ${i + 1}`);
                document.querySelector(".item-details-container")?.scrollIntoView({ behavior: "smooth", block: "center" });
                return false;
            }
            if (!item.rate) {
                toast.error(`⚠️ Rate required in Row ${i + 1}`);
                document.querySelector(".item-details-container")?.scrollIntoView({ behavior: "smooth", block: "center" });
                return false;
            }
        }

        return true; // ✅ sab filled hai
    };


    const handleReset = () => {
        sessionStorage.removeItem("bookingData"); // clear storage first

        setBookingData({
            ...defaultBookingData,
            entryDate: dayjs(),
            entryTime: dayjs(),
            bookingFromDate: dayjs(),
            bookingFromTime: dayjs(),
            bookingToDate: dayjs(),
            bookingToTime: dayjs(),
            customer: {
                partyName: "",
                companyName: "",
                functionName: "",
            },
            eventDetails: {
                venue: "",
                servingName: "",
                servingAddress: "",
                minPeople: "",
                maxPeople: "",
            },
            itemDetails: [],
        });

        setCurrentItem({
            ...defaultItem,
            itemDate: dayjs(),
            quantity: "1",
            rate: "",
            description: "",
        });

        setOtherCharges("");
        setSettlementDiscount("");
        setEditingIndex(null);

        toast.info("Form has been reset 🔄", { toastId: "form-reset" });
    };

    const [otherCharges, setOtherCharges] = useState("");
    const [settlementDiscount, setSettlementDiscount] = useState("");

    const subTotal = bookingData.itemDetails.reduce((sum, item) => {
        const qty = Number(item.quantity) || 0;
        const rate = Number(item.rate) || 0;
        return sum + qty * rate;
    }, 0);

    const totalDiscount = bookingData.itemDetails.reduce(
        (sum, item) => sum + (Number(item.discount) || 0),
        0
    );

    const taxableAmount = subTotal - totalDiscount;
    const taxAmount = (taxableAmount * FIXED_TAX_PERCENT) / 100;

    const grossAmount =
        taxableAmount +
        taxAmount +
        (Number(otherCharges)) -
        (Number(settlementDiscount));

    const roundOff = Math.round(grossAmount) - grossAmount;
    const billAmount = grossAmount + roundOff;

    useEffect(() => {
        const savedScrollY = sessionStorage.getItem("scrollPosition");

        if (savedScrollY) {
            requestAnimationFrame(() => {
                window.scrollTo(0, parseInt(savedScrollY, 10));
            });
        }
    }, [location.key]); // runs every time you navigate back


    // Move focus to next input on Enter
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // stop form submit
            const form = e.target.form;
            const index = Array.prototype.indexOf.call(form, e.target);
            const next = form.elements[index + 1];
            if (next) {
                next.focus();
            }
        }
    };
    useEffect(() => {
        const hotelId = localStorage.getItem("hotel_id");
        console.log("Hotel ID:", hotelId);
    }, []);
    // ---- Fetch Helpers ------------------------------------------------------
    const fetchWithHotelId = async () => {
        const hotelId = localStorage.getItem("hotel_id");
        if (!hotelId) throw new Error("No hotel_id found in localStorage");

        const formData = new FormData();
        formData.append("hotel_id", hotelId);

        const response = await fetch(`http://52.66.71.147/banquetapi/get_server_date.php?hotel_id=${hotelId}`, {
            method: "POST",
            body: formData,
        });
        if (!response.ok) throw new Error("Network error");
        return response.json();

    };
    const fetchStatuses = async () => {
        const hotelId = localStorage.getItem("hotel_id");
        if (!hotelId) throw new Error("No hotel_id found in localStorage");

        const formData = new FormData();
        formData.append("hotel_id", hotelId);
        formData.append("search_param", "");  // empty = get all
        formData.append("para", "single_quot");

        const response = await fetch(`http://52.66.71.147/banquetapi/search_status.php?hotel_id=${hotelId}`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Network error");
        return response.json();
    };

    // ---- Load API Data ------------------------------------------------------
    useEffect(() => {
        const loadData = async () => {
            // 4. Statuses
            const statusData = await fetchStatuses();
            if (Array.isArray(statusData.result)) {
                setStatuses(statusData.result);
            }

            try {
                const data = await fetchWithHotelId();

                // 1. Server date
                if (data.result?.[0]?.ServerDate) {
                    const serverDate = dayjs(data.result[0].ServerDate, "DD-MM-YYYY");
                    setBookingData((prev) => ({
                        ...prev,
                        entryDate: serverDate,
                        entryTime: serverDate,
                        bookingFromDate: serverDate,
                        bookingFromTime: serverDate,
                        bookingToDate: serverDate,
                        bookingToTime: serverDate,
                    }));
                }

                // 2. Companies
                if (Array.isArray(data.result2)) {
                    setBillingCompanies(data.result2);
                }

                // 3. Users
                if (Array.isArray(data.result3)) {
                    setAttendees(data.result3);
                }
            } catch (err) {
                console.error("Error fetching API data:", err);
            }
        };

        loadData();
    }, []);


    return (
        <>
            {/* Back button */}
            <div className="back-button">
                <button type="button" onClick={handleBackClick}>
                    <TiArrowBackOutline size={40} />
                </button>
                <h1>New Booking</h1>
            </div>

            {/* Confirm Dialog */}
            <Dialog open={openConfirm} onClose={handleCancel}>
                <DialogTitle>Go Back?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to go back? Unsaved changes will be lost.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} color="error" autoFocus>
                        Yes, Go Back
                    </Button>
                </DialogActions>
            </Dialog>



            <div className="formContainer">
                <form onSubmit={handleSubmit}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        {/* Entry Date & Time */}
                        <div className="datetime">
                            <DatePicker
                                label="Entry Date"
                                value={bookingData.entryDate}
                                onChange={(v) => handleDateChange("entryDate", v)}
                                format="DD-MM-YYYY"
                                readOnly
                            />
                            <TimePicker
                                label="Entry Time"
                                value={bookingData.entryTime}
                                onChange={(v) => handleDateChange("entryTime", v)}
                                ampm
                                readOnly
                            />

                        </div>

                        {/* Billing Company */}
                        <div id="billing-companies">
                            <h3>Billing Company</h3>
                            <select
                                name="billingCompany"
                                value={bookingData.billingCompany}
                                onChange={(e) =>
                                    setBookingData((p) => ({ ...p, billingCompany: e.target.value }))
                                }
                                ref={billingCompanyRef}
                                required
                            >
                                <option hidden>Select Company</option>
                                {billingCompanies.map((c) => (
                                    <option key={c.BillingCompanyId} value={c.Name}>
                                        {c.Name}
                                    </option>
                                ))}
                            </select>


                        </div>

                        {/* Attended By */}
                        <div id="attended">
                            <h3>Attended By</h3>
                            <select
                                name="attendedBy"
                                value={bookingData.attendedBy}
                                onChange={(e) =>
                                    setBookingData((p) => ({ ...p, attendedBy: e.target.value }))
                                }
                                ref={attendedByRef}
                                required
                            >
                                <option hidden>Select Attendee</option>
                                {attendees.map((a) => (
                                    <option key={a.Userid} value={a.Name}>
                                        {a.Name}
                                    </option>
                                ))}
                            </select>

                        </div>

                        {/* Status */}
                        <div id="status">
                            <h3>Status</h3>
                            <select
                                name="status"
                                value={bookingData.status}
                                onChange={(e) => setBookingData((p) => ({ ...p, status: e.target.value }))}
                                ref={statusRef}
                                required
                                onKeyDown={handleKeyDown}
                            >
                                <option hidden>Select Status</option>
                                {statuses.map((s) => (
                                    <option key={s.LedgerId} value={s.LedgerName}>
                                        {s.LedgerName}
                                    </option>
                                ))}
                            </select>

                        </div>

                        {/* Booking Dates */}
                        <div className="pickers">
                            <div className="booking-date">
                                <DatePicker
                                    label="Booking From"
                                    value={bookingData.bookingFromDate}
                                    onChange={(v) => handleDateChange("bookingFromDate", v)} onKeyDown={handleKeyDown}
                                    format="DD-MM-YYYY"
                                />
                                <TimePicker
                                    label="Booking Time"
                                    value={bookingData.bookingFromTime}
                                    onChange={(v) => handleDateChange("bookingFromTime", v)} onKeyDown={handleKeyDown}
                                    ampm
                                />
                            </div>
                            <div className="booking-to">
                                <DatePicker
                                    label="Booking To"
                                    value={bookingData.bookingToDate}
                                    onChange={(v) => handleDateChange("bookingToDate", v)}
                                    format="DD-MM-YYYY"
                                />
                                <TimePicker
                                    label="To Time"
                                    value={bookingData.bookingToTime}
                                    onChange={(v) => handleDateChange("bookingToTime", v)} onKeyDown={handleKeyDown}
                                    ampm
                                />
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="customer-info">
                            <h3>Party Name</h3>
                            <div className="party-name" onClick={handleNewParty}
                                ref={partyNameRef}
                                required>
                                <span>{bookingData.customer.partyName || "No Party Selected"}</span>
                                <AiFillEdit size={22} />
                            </div>
                        </div>

                        <div className="customer-info">
                            <h3>Company Name</h3>
                            <div className="party-name" onClick={handleNewCompany}
                                ref={companyNameRef}
                                required>
                                <span>{bookingData.customer.companyName || "No Company Selected"}</span>
                                <AiFillEdit size={22} />
                            </div>
                        </div>

                        <div className="customer-info">
                            <h3>Function Name</h3>
                            <div className="party-name" onClick={handleNewFunction} ref={functionNameRef}
                                required>
                                <span>{bookingData.customer.functionName || "No Function Selected"}</span>
                                <AiFillEdit size={22} />
                                <span className="add-more" onClick={addNewFunction}>
                                    more
                                </span>
                            </div>
                        </div>

                        {/* Event Details */}
                        <div className="event-details-container">
                            <h1>Event Details</h1>
                            <h4>Venue Status</h4>
                            <div id="venue">
                                <h3>Venue</h3>
                                <select name="eventDetails" value={bookingData.eventDetails.venue || ""} onChange={handleChange}
                                    ref={venueRef}
                                    required
                                    onKeyDown={handleKeyDown}>
                                    <option hidden>Select Venue</option>
                                    {venues.map((v, i) => (
                                        <option key={i} value={v}>
                                            {v}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="serving">
                                <h3>Serving Name</h3>
                                <div className="serving-name" onClick={handleServingNames}>
                                    <span>{bookingData.eventDetails.servingName || "No Serving Selected"}</span>
                                    <AiFillEdit size={22} />
                                </div>

                                <div className="serving-address">
                                    <h3>Serving Address</h3>
                                    <textarea
                                        name="servingAddress"
                                        value={bookingData.eventDetails.servingAddress || ""}
                                        onChange={handleChange} onKeyDown={handleKeyDown}
                                    />
                                </div>
                            </div>

                            <div className="min-maxppl">
                                <div className="min">
                                    <h3>MIN PAX</h3>
                                    <input
                                        type="number"
                                        name="minPeople"
                                        value={bookingData.eventDetails.minPeople || ""}
                                        onChange={handleChange}
                                        ref={minPeopleRef}
                                        required
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>
                                <div className="max">
                                    <h3>MAX PAX</h3>
                                    <input
                                        type="number"
                                        name="maxPeople"
                                        value={bookingData.eventDetails.maxPeople || ""}
                                        onChange={handleChange}
                                        ref={maxPeopleRef}
                                        required
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Item Details */}
                        <div className="item-details-container">
                            <h2>Item Details</h2>
                            <div className="item-contents">
                                <div className="datetime">
                                    <h3>Date:</h3>
                                    <DatePicker
                                        label="Item Date"
                                        value={currentItem.itemDate}
                                        onChange={(v) => setCurrentItem((prev) => ({ ...prev, itemDate: v }))} onKeyDown={handleKeyDown}
                                        format="DD-MM-YYYY"
                                    />
                                </div>

                                <h3>Select Items</h3>
                                <div className="items" onClick={handleItemPage}>
                                    <span>{currentItem.itemName || "No item Selected"}</span>
                                    <AiFillEdit size={22} />
                                </div>

                                <div className="itemsSection">
                                    <div className="qtty">
                                        <h3>Quantity</h3>
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={currentItem.quantity}
                                            onChange={(e) => setCurrentItem((prev) => ({ ...prev, quantity: e.target.value }))} onKeyDown={handleKeyDown}
                                        />
                                    </div>
                                    <div className="rate">
                                        <h3>Rate</h3>
                                        <input
                                            type="number"
                                            name="rate"
                                            value={currentItem.rate}
                                            onChange={(e) => setCurrentItem((prev) => ({ ...prev, rate: e.target.value }))} onKeyDown={handleKeyDown}
                                        />
                                    </div>
                                    <div className="amount">
                                        <h3>Amount</h3>
                                        <input
                                            type="text"
                                            readOnly
                                            value={(Number(currentItem.quantity) || 0) * (Number(currentItem.rate) || 0)}
                                        />
                                    </div>
                                </div>

                                <div className="ItemNote">
                                    <h3>Note</h3>
                                    <textarea
                                        name="description"
                                        value={currentItem.description}
                                        onChange={(e) => setCurrentItem((prev) => ({ ...prev, description: e.target.value }))} onKeyDown={handleKeyDown}
                                    />
                                </div>

                                {/* Add button (kept same) */}
                                <div className="addItem">
                                    <button type="button" className="addb" onClick={handleAddItem}>
                                        {editingIndex !== null ? "UPDATE" : "ADD"}
                                    </button>
                                </div>
                                {/* Items Table */}
                                {bookingData.itemDetails.length > 0 && (
                                    <div className="tableItem">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>X</th>
                                                    <th>M</th>
                                                    <th>Sr No</th>
                                                    <th>Date</th>
                                                    <th>Item</th>
                                                    <th>Qty</th>
                                                    <th>Rate</th>
                                                    <th>Amount</th>
                                                    <th>Discount</th>
                                                    <th>Taxable</th>
                                                    <th>Tax Name</th>
                                                    <th>Tax %</th>
                                                    <th>Tax Amt</th>
                                                    <th>Total</th>
                                                    <th>Note</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {bookingData.itemDetails.map((item, idx) => {
                                                    const qty = Number(item.quantity) || 0;
                                                    const rate = Number(item.rate) || 0;
                                                    const amount = qty * rate;
                                                    const discount = Number(item.discount || 0);
                                                    const taxable = Math.max(0, amount - discount);
                                                    const taxAmt = (taxable * FIXED_TAX_PERCENT) / 100;
                                                    const total = taxable + taxAmt;
                                                    return (
                                                        <tr key={idx}>
                                                            <td>
                                                                <button type="button" onClick={() => handleDeleteItem(idx)}>
                                                                    ❌
                                                                </button>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setCurrentItem({ ...item });
                                                                        setEditingIndex(idx);
                                                                    }}
                                                                >
                                                                    ✏️
                                                                </button>


                                                            </td>
                                                            <td>{idx + 1}</td>
                                                            <td>{item.itemDate ? dayjs(item.itemDate).format("DD-MM-YYYY") : ""}</td>
                                                            <td>{item.itemName}</td>
                                                            <td>{qty}</td>
                                                            <td>{rate}</td>
                                                            <td>{amount}</td>
                                                            <td>
                                                                <input
                                                                    type="number"
                                                                    value={discount}
                                                                    onChange={(e) => handleRowDiscountChange(idx, e.target.value)}
                                                                    onKeyDown={handleKeyDown}
                                                                    style={{ width: "100%" }}
                                                                />
                                                            </td>
                                                            <td>{taxable}</td>
                                                            <td>{FIXED_TAX_NAME}</td>
                                                            <td>{FIXED_TAX_PERCENT}</td>
                                                            <td>{taxAmt}</td>
                                                            <td>{total}</td>
                                                            <td>{item.description}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Bill Details Section */}
                        <div className="bill-details-container">
                            <h2>Bill Details</h2>
                            <table className="bill-table">
                                <tbody>
                                    <tr>
                                        <td><b>Sub Total</b></td>
                                        <td>{subTotal.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td>Discount</td>
                                        <td>{totalDiscount.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td>Taxable Amount</td>
                                        <td>{taxableAmount.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td>Tax Amount</td>
                                        <td>{taxAmount.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td>Other Charges</td>
                                        <td>
                                            <input
                                                type="number"
                                                value={otherCharges}
                                                onChange={(e) => setOtherCharges(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Settlement Discount</td>
                                        <td>
                                            <input
                                                type="number"
                                                value={settlementDiscount}
                                                onChange={(e) => setSettlementDiscount(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Round off</td>
                                        <td>{roundOff.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Bill Amount</b></td>
                                        <td><b>{billAmount.toFixed(2)}</b></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {/* Buttons */}
                        <div className="buttonContainer">
                            <button type="button" onClick={handleSaveClick}>Save Event</button>

                            <button
                                type="button"
                                style={{ marginLeft: "10px", backgroundColor: "#f44336", color: "#fff" }}
                                onClick={handleReset}
                            >
                                Reset
                            </button>

                        </div>
                    </LocalizationProvider>
                </form>
            </div>
            {/* Save Confirmation Dialog */}
            <Dialog open={openSaveConfirm} onClose={handleSaveCancel}>
                <DialogTitle>Save Event?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to save this event?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSaveCancel} color="primary">
                        No
                    </Button>
                    <Button onClick={handleSaveConfirm} color="success" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer position="top-center" autoClose={2000} />
        </>
    );
}
export default NewBooking;