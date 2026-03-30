import "@styles/main.scss";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";

import Navbar from "@modules/shared/components/Navbar";
import Footer from "@modules/shared/components/Footer";
import HomePage from "./pages/Home";

import { ROUTES } from "@constants/route";

function App() {
  return (
    <HashRouter>
      <a href="#main-content" className="skip-link" tabIndex={0}>
        Aller au contenu principal
      </a>
      <Navbar />
      <main id="main-content">
        <Routes>
          <Route path={ROUTES.HOME.route} element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </HashRouter>
  );
}

export default App;
