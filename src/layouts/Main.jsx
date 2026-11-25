import Header from "../components/shared/landingPage/header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/shared/landingPage/Footer";

const Main = () => {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Main;
