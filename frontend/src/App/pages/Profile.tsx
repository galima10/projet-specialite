import { useAppDispatch, useAppSelector } from "@modules/shared/hooks/redux";
import { logoutThunk } from "@stores/thunks/users";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { currentUser } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  function handleLogout() {
    dispatch(logoutThunk());
    navigate("/");
  }
  return (
    <>
      <h1>Profile page</h1>
      <p>Nom : {currentUser.name}</p>
      <p>Email: {currentUser.email}</p>
      <p>Rôle: {currentUser.role}</p>
      <button onClick={handleLogout}>Déconnecter</button>
    </>
  );
}
