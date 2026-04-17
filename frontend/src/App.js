import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css"; 
import "./index.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import { isAuthenticated } from "./services/api";
import { CartProvider } from "./contexts/CartContext";
import { SettingsProvider } from "./contexts/SettingsContext";

import GlobalBanner from "./components/Banner";
import GlobalFooter from "./components/Footer";
import Navigation from "./components/Navigation";

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <SettingsProvider>
      <CartProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <GlobalBanner />
          <Navigation />
          <div className="page-wrapper">
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } />
              <Route path="/cart" element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="*" element={<Navigate to={isAuthenticated() ? "/" : "/login"} replace />} />
            </Routes>
          </div>
          <GlobalFooter />
        </div>
      </CartProvider>
    </SettingsProvider>
  );
}

export default App;
