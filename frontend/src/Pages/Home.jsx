import React from "react";
import HomeBanner from "../Components/HomeBanner";
import HomeCars from "../Components/HomeCars";
import Testimonial from "../Components/Testimonial";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";

const Home = () => {
  return (
    <div>
      <Navbar></Navbar>
      <HomeBanner />
      <HomeCars />
      <Testimonial />
      <Footer />
    </div>
  );
};

export default Home;
