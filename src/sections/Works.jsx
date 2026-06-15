import { Icon } from "@iconify/react/dist/iconify.js";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { projects } from "../constants";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useNavigate } from "react-router-dom";

const Works = () => {
  const navigate = useNavigate();
  const overlayRefs = useRef([]);

  const [currentIndex, setCurrentIndex] = useState(null);
  const text = `A collection of projects built
while learning, experimenting, and improving.`;

  useGSAP(() => {

    gsap.from("#project", {
      y: 100,
      opacity: 0,
      delay: 0.5,
      duration: 1,
      stagger: 0.3,
      ease: "back.out",
      scrollTrigger: {
        trigger: "#project",
      },
    });
  }, []);

  const handleMouseEnter = (index) => {
    if (window.innerWidth < 768) return;
    setCurrentIndex(index);

    const el = overlayRefs.current[index];
    if (!el) return;

    gsap.killTweensOf(el);
    gsap.fromTo(
      el,
      {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
      },
      {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
        duration: 0.15,
        ease: "power2.out",
      }
    );

  };

  const handleMouseLeave = (index) => {
    if (window.innerWidth < 768) return;
    setCurrentIndex(null);

    const el = overlayRefs.current[index];
    if (!el) return;

    gsap.killTweensOf(el);
    gsap.to(el, {
      clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
      duration: 0.2,
      ease: "power2.in",
    });

  };

  return (
    <section id="work" className="flex flex-col min-h-screen">
      <AnimatedHeaderSection

        title={"PROJECTS"}
        text={text}
        textColor={"text-white"}
        withScrollTrigger={true}
      />
      <div className="relative flex flex-col font-light border-t border-white/20">
        {projects.map((project, index) => (
          <div
            key={project.id}
            id="project"
            onClick={() => navigate(`/project/${project.id}`)}
            className="relative flex flex-col gap-4 py-8 md:py-12 border-b border-white/20 cursor-pointer group md:gap-0"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            {/* overlay */}
            <div
              ref={(el) => {
                overlayRefs.current[index] = el;
              }}
              className="absolute inset-0 hidden md:block duration-200 bg-black -z-10 clip-path"
            />

            {/* title */}
            <div className="flex justify-between px-10 text-white transition-all duration-500 md:group-hover:px-12 md:group-hover:text-amber-500">
              <h2 className="lg:text-[32px] text-[26px] leading-none">
                {project.name}
              </h2>
            </div>
            
            {/* INLINE IMAGE EXPANSION CONTAINER */}
            <div 
              className={`grid transition-all duration-500 ease-[cubic-bezier(0.5,0,0,1)] ${
                currentIndex === index ? "grid-rows-[1fr] opacity-100 my-4" : "grid-rows-[0fr] opacity-0 my-0"
              }`}
            >
              <div className="overflow-hidden px-10 md:px-12">
                <div className="relative w-full md:w-3/4 lg:w-1/2 h-48 md:h-64 rounded-xl overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.name} 
                    className="object-cover w-full h-full"
                  />
                  {/* Subtle dark overlay */}
                  <div className="absolute inset-0 bg-black/10"></div>
                </div>
              </div>
            </div>


            {/* mobile preview text */}
            <div className="relative flex flex-col items-start justify-center px-10 py-6 md:hidden">
              <p className="text-sm leading-relaxed whitespace-pre-line text-gray-300">
                {project.longDescription}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Works;
