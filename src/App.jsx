import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginForm from "./components/LoginForm";
import MainDashboard from "./components/MainDashboard";
import MakeBooking from "./components/pages/MakeBooking";
import NewBooking from "./components/pages/NewBooking";
import NewParty from "./components/pages/NewParty";
import NewCompany from "./components/pages/newCompany";
import NewFunction from "./components/pages/NewFunction";
import AddNewFunction from "./components/pages/AddNewFunction";
import NewServing from "./components/pages/NewServing";
import Items from "./components/pages/Items";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        pauseOnHover
        draggable
        theme="colored"
      />

      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginForm />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/make-booking"
          element={
            <ProtectedRoute>
              <MakeBooking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-booking"
          element={
            <ProtectedRoute>
              <NewBooking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-party"
          element={
            <ProtectedRoute>
              <NewParty />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-company"
          element={
            <ProtectedRoute>
              <NewCompany />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-function"
          element={
            <ProtectedRoute>
              <NewFunction />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-function"
          element={
            <ProtectedRoute>
              <AddNewFunction />
            </ProtectedRoute>
          }
        />
        <Route
          path="/serving-names"
          element={
            <ProtectedRoute>
              <NewServing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/items"
          element={
            <ProtectedRoute>
              <Items />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
