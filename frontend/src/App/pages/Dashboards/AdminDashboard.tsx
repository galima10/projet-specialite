import { useNavigate } from "react-router-dom";
import { ROUTES } from "@constants/route";

export default function AdminDashboard() {
  const navigate = useNavigate();
  function handleProfile() {
    navigate("/profile");
  }
  return (
    <>
      <h1>Dashboard admin</h1>
      <button onClick={handleProfile}>Profil</button>
    </>
  );
}
