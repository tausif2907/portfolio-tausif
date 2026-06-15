import React, { useEffect } from "react";
import Hero from "../sections/Hero";
import ServiceSummary from "../sections/ServiceSummary";
import Services from "../sections/Services";
import About from "../sections/About";
import Works from "../sections/Works";
import ContactSummary from "../sections/ContactSummary";
import Contact from "../sections/Contact";

const Home = () => {
  useEffect(() => {
    const shouldReturn = sessionStorage.getItem("returnToWork");
    
    if (shouldReturn) {
      sessionStorage.removeItem("returnToWork");
      const scroll = () => {
        const element = document.getElementById("work");
        if (element) {
          element.scrollIntoView({ behavior: "instant", block: "start" });
        }
      };
      
      // Attempt to scroll immediately, and then again after a few short delays
      // This ensures that if Hero or About sections take a split second to render
      // or expand their heights, we still snap correctly to the Works section.
      scroll();
      setTimeout(scroll, 100);
      setTimeout(scroll, 300);
      setTimeout(scroll, 600);
    } else {
      // Force scroll to top on normal loads/refreshes
      window.scrollTo(0, 0);
      setTimeout(() => window.scrollTo(0, 0), 100);
    }
  }, []);

  return (
    <>
      <Hero />
      <ServiceSummary />
      <Services />
      <About />
      <Works />
      <ContactSummary />
      <Contact />
    </>
  );
};

export default Home;
