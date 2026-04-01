import "@styles/main.scss";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";

import Header from "@modules/shared/components/Header";
import Footer from "@modules/shared/components/Footer";

import HomePage from "@App/pages/Home";
import AdminDashboard from "@App/pages/Dashboards/AdminDashboard";
import TreasurerDashboard from "@App/pages/Dashboards/TreasurerDashboard";
import MemberDashboard from "@App/pages/Dashboards/MemberDashboard";
import ProfilePage from "@App/pages/Profile";
import LoginPage from "@App/pages/Auth/LoginPage";
import RegisterPage from "@App/pages/Auth/RegisterPage";

import { useAppDispatch, useAppSelector } from "@modules/shared/hooks/redux";
import { useEffect } from "react";
import { fetchCurrentUserThunk } from "@stores/thunks/users";

import { ROUTES } from "@constants/route";

import { Navigate } from "react-router-dom";

function PublicRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME.route} element={<HomePage />} />
      <Route path={ROUTES.LOGIN.route} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER.route} element={<RegisterPage />} />
      <Route path="*" element={<Navigate to={ROUTES.HOME.route} />} />
    </Routes>
  );
}

function AuthenticatedRoutes() {
  const { currentUser } = useAppSelector((state) => state.user);

  if (!currentUser) return <Navigate to={ROUTES.LOGIN.route} />;

  let dashboardRoute: string;
  let DashboardComponent: React.FC;

  switch (currentUser.role) {
    case "ROLE_ADMIN":
      dashboardRoute = ROUTES.DASHBOARDS.ADMIN.route;
      DashboardComponent = AdminDashboard;
      break;
    case "ROLE_TREASURER":
      dashboardRoute = ROUTES.DASHBOARDS.TREASURER.route;
      DashboardComponent = TreasurerDashboard;
      break;
    case "ROLE_MEMBER":
      dashboardRoute = ROUTES.DASHBOARDS.MEMBER.route;
      DashboardComponent = MemberDashboard;
      break;
    default:
      dashboardRoute = ROUTES.HOME.route;
      DashboardComponent = HomePage;
  }

  return (
    <Routes>
      <Route path={dashboardRoute} element={<DashboardComponent />} />
      <Route path={ROUTES.PROFILE.route} element={<ProfilePage />} />
      <Route path="*" element={<Navigate to={dashboardRoute} replace />} />
    </Routes>
  );
}

export default function App() {
  const dispatch = useAppDispatch();
  const { currentUser, loading } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchCurrentUserThunk());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <a href="#main-content" className="skip-link" tabIndex={0}>
        Aller au contenu principal
      </a>
      <Header />
      <main id="main-content">
        {currentUser ? <AuthenticatedRoutes /> : <PublicRoutes />}
      </main>
      <Footer />
    </BrowserRouter>
  );
}
