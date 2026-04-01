import HomeHero from "@modules/home/components/organisms/HomeHero";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <h1>Home</h1>
      <button onClick={() => navigate("/login")}>Login</button>
    </>
  );
}
