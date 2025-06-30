import React from "react";

const Hero = () => {
  const clientImages = [
    "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/google.svg",
    "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/microsoft.svg",
    "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazon.svg",
    "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/apple.svg",
    "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/meta.svg",
    "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/netflix.svg",
    "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/google.svg",
    "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/microsoft.svg",
    "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazon.svg",
    "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/apple.svg",
    "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/meta.svg",
    "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/netflix.svg",
  ];

  return (
    <div
      className="relative lg:h-[700px] bg-cover bg-center flex flex-col justify-start"
      style={{
        backgroundImage: `url('https://i.ibb.co/YB1DDMjb/5777557-21533.jpg')`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent z-0" />

      {/* Image Section - visible on all devices */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-1/2 z-10">
        <img
          src="https://i.ibb.co/8DbGRYBh/female-wedding-planner-working-ceremony.jpg"
          alt="Event"
          className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity duration-500"
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 w-full px-4 sm:px-6 lg:px-16 pt-6 sm:pt-12 lg:pt-32 pb-16 lg:pb-20 lg:w-1/2">
        <div className="max-w-3xl text-white space-y-6">
          <p className="text-base sm:text-lg font-semibold text-red-300 tracking-wide animate-fadeIn">
            Find Your Next Experience
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight animate-fadeInUp">
            Discover & Promote <br />
            <span className="text-red-500">Upcoming Events</span>
          </h1>

          {/* Marquee Clients Section */}
          <div className="mt-10 sm:mt-12 animate-fadeInUp">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 border-b-2 border-red-500 pb-2 inline-block">
              Trusted by Leading Organizers
            </h3>
            <div className="relative w-full overflow-hidden py-4 sm:py-6 bg-white/10 rounded-xl shadow-inner border border-white/20">
              <div className="flex animate-marquee whitespace-nowrap items-center">
                {clientImages.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Client ${index + 1}`}
                    className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 mx-4 sm:mx-6 p-2 bg-white/50 rounded-full shadow-md hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/50?text=?";
                    }}
                  />
                ))}
              </div>
              {/* Optional gradient overlays */}
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/60 via-black/20 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Hero;
