import Header from "../components/shared/landingPage/header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/shared/landingPage/Footer";
import ButtonGradient from "../assets/Home/svg/ButtonGradient";

const Main = () => {
  return (
    <section className="min-h-screen bg-n-8 text-n-1">
      <Header />
      <Outlet />
      <Footer />
      <ButtonGradient />
    </section>
  );
};

export default Main;
