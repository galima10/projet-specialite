import { useNavigate } from "react-router-dom";
import ContentMemberDashboard from "@modules/dashboards/components/organisms/ContentMemberDashboard";

export default function AdminDashboard() {
  const navigate = useNavigate();
  function handleProfile() {
    navigate("/profile");
  }
  return (
    <>
      <h1>Dashboard admin</h1>
      <ContentMemberDashboard />
    </>
  );
}
