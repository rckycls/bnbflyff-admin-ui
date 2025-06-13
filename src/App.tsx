import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/authenticated/Dashboard";
import AuthLayout from "./components/layout/AuthLayout";
import RequireAuth from "./middleware/RequireAuth";
import ManageAccounts from "./pages/authenticated/ManageAccounts";
import ManageCharacters from "./pages/authenticated/ManageCharacters";
import CreateAccount from "./pages/authenticated/CreateAccount";
import UpdateCharacter from "./pages/authenticated/UpdateCharacter";
import ViewCharacterInventory from "./pages/authenticated/ViewCharacterInventory";
import PageLoader from "./components/PageLoader";
import { useLoader } from "./context/PageLoaderContext";
import ViewTradeLogs from "./pages/authenticated/ViewTradeLogs";

const App: React.FC = () => {
  const { loading } = useLoader();

  return (
    <>
      {loading && <PageLoader />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route element={<AuthLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/accounts" element={<ManageAccounts />} />
            <Route path="/accounts/new" element={<CreateAccount />} />
            <Route path="/characters" element={<ManageCharacters />} />
            <Route
              path="/characters/inventory"
              element={<ViewCharacterInventory />}
            />
            <Route
              path="/characters/view/:m_idPlayer"
              element={<UpdateCharacter />}
            />
            <Route path="/trade-logs" element={<ViewTradeLogs />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
