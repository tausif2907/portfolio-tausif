import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { projects } from "../constants";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find project based on ID
  const project = projects.find((p) => p.id === parseInt(id));

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white bg-black">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <Link to="/" className="px-6 py-3 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500/30">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 backdrop-blur-md bg-black/50 border-b border-white/10 flex items-center justify-between">
        <button 
          onClick={() => {
            sessionStorage.setItem("returnToWork", "true");
            navigate("/");
          }}
          className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-amber-500 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        {/* Header Section */}
        <div className="mb-16">
          {project.subtitle && (
            <p className="text-sm tracking-[0.2em] uppercase text-gray-400 mb-4">{project.subtitle}</p>
          )}
          <h1 className="text-5xl md:text-7xl font-light mb-6 leading-tight">
            {project.displayTitle || project.name}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-16">
            <div className="lg:col-span-12">
              {project.challenge || project.solution ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
                  {project.challenge && (
                    <div>
                      <h3 className="text-sm tracking-[0.2em] uppercase text-gray-400 mb-6">The Challenge</h3>
                      <p className="text-xl leading-relaxed text-gray-300 font-light whitespace-pre-line">
                        {project.challenge}
                      </p>
                    </div>
                  )}
                  {project.solution && (
                    <div>
                      <h3 className="text-sm tracking-[0.2em] uppercase text-gray-400 mb-6">The Solution</h3>
                      <p className="text-xl leading-relaxed text-gray-300 font-light whitespace-pre-line">
                        {project.solution}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xl leading-relaxed text-gray-300 font-light whitespace-pre-line">
                  {project.longDescription}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="flex flex-col gap-10 md:gap-20 mt-20">
          {project.images && project.images.map((img, index) => (
            <div key={index} className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900/50">
              <img 
                src={img} 
                alt={`${project.name} preview ${index + 1}`} 
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;
