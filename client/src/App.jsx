import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './features/auth/AuthContext.jsx';
import { LoginPage } from './features/auth/LoginPage.jsx';
import { DashboardPage } from './features/dashboard/DashboardPage.jsx';
import { AppLayout } from './layouts/AppLayout.jsx';
import { PlaceholderPage } from './components/PlaceholderPage.jsx';
function Protected() { const { user, ready } = useAuth(); if (!ready) return <div className="loading">Loading FuelFlow…</div>; return user ? <AppLayout /> : <Navigate to="/login" replace />; }
export function App() { return <Routes><Route path="/login" element={<LoginPage />} /><Route element={<Protected />}><Route path="/" element={<DashboardPage />} /><Route path="/day-entries" element={<PlaceholderPage title="Day Entries" description="Record pump readings, sales, and collections." />} /><Route path="/fuel-inwards" element={<PlaceholderPage title="Fuel Inwards" description="Keep every tanker delivery and historical cost." />} /><Route path="/reconciliation" element={<PlaceholderPage title="Stock Reconciliation" description="Compare expected and physical underground stock." />} /><Route path="/branches" element={<PlaceholderPage title="Branches" description="Manage branches within your subscription limits." />} /><Route path="/reports" element={<PlaceholderPage title="Reports" description="Filter operational and financial reports." />} /></Route></Routes>; }
