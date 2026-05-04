import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import PrivateRoute from "./routes/PrivateRoute";
import Navbar from "./components/Navbar";
import MyRaffles from "./pages/MyRaffles";
import CreateRaffle from "./pages/CreateRaffle";
import RaffleDetail from "./pages/RaffleDetail";
import MeusVendedores from "./pages/MeusVendedores";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* PRIVATE */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-raffles"
          element={
            <PrivateRoute role="organizador">
              <MyRaffles />
            </PrivateRoute>
          }
        />

        <Route
          path="/create-raffle"
          element={
            <PrivateRoute role="organizador">
              <CreateRaffle />
            </PrivateRoute>
          }
        />

        <Route
          path="/raffles/:id"
          element={
            <PrivateRoute>
              <RaffleDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/raffles/edit/:id"
          element={
            <PrivateRoute role="organizador">
              <CreateRaffle />
            </PrivateRoute>
          }
        />
        <Route path="/vendedores" element={<MeusVendedores />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;