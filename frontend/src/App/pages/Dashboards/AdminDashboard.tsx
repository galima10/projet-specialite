import { useNavigate } from "react-router-dom";
import ContentAdminDashboard from "@modules/dashboards/components/organisms/ContentAdminDashboard";
export default function AdminDashboard() {
  const navigate = useNavigate();
  function handleProfile() {
    navigate("/profile");
  }
  return (
    <>
      <h1>Dashboard admin</h1>
      <ContentAdminDashboard />
    </>
  );
}
