import Header from "../components/shared/landingPage/header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/shared/landingPage/Footer";

const Main = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0607] text-zinc-100 selection:bg-red-600/35 selection:text-red-100">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Main;
