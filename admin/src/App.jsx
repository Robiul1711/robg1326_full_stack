import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

import { store } from "./redux/store";
import { SocketProvider } from "./context/SocketContext";

import AdminLayout from "./components/layout/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CategoriesAndModels from "./pages/CategoriesAndModels";
import RepairServices from "./pages/RepairServices";
import Marketplace from "./pages/Marketplace";
import CMSManager from "./pages/CMSManager";
import PolicyManager from "./pages/PolicyManager";
import Leads from "./pages/Leads";

function App() {
  return (
    <Provider store={store}>
      <SocketProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#18181b",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.1)",
                fontSize: "13px",
              },
            }}
          />
          <Routes>
            {/* Public Auth Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route path="/" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="devices" element={<CategoriesAndModels />} />
              <Route path="services" element={<RepairServices />} />
              <Route path="marketplace" element={<Marketplace />} />
              <Route path="cms" element={<CMSManager />} />
              <Route path="policies" element={<PolicyManager />} />
              <Route path="leads" element={<Leads />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </Provider>
  );
}

export default App;
