import React from "react";

const Extra = () => {
  return (
    <div className="">
      {/* Stats Section with Background Image and Overlay */}
      <div className="relative bg-cover bg-center py-16 px-6 text-white overflow-hidden"
        style={{
          backgroundImage:
            "url(https://i.ibb.co/s92v032M/people-take-off-camera-gadgets-top-view-holiday.jpg)",
        }}
      >
        {/* Black Overlay */}
        <div className="absolute inset-0 bg-red-500/40 z-0"></div>

        <div className="relative z-10 max-w-7xl p-10 mx-auto text-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white/10 p-6 border rounded-xl backdrop-blur-sm hover:scale-105 transition">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-3xl font-bold">1256</p>
              <p className="text-lg">PARTICIPANT</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/10 p-6 rounded-xl border backdrop-blur-sm hover:scale-105 transition">
              <div className="text-4xl mb-2">📍</div>
              <p className="text-3xl font-bold">255</p>
              <p className="text-lg">TOTAL EVENTS</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white/10 p-6 rounded-xl border backdrop-blur-sm hover:scale-105 transition">
              <div className="text-4xl mb-2">🏟️</div>
              <p className="text-3xl font-bold">09</p>
              <p className="text-lg">VENUES</p>
            </div>

            {/* Card 4 */}
            <div className="bg-white/10 p-6 rounded-xl border backdrop-blur-sm hover:scale-105 transition">
              <div className="text-4xl mb-2">💰</div>
              <p className="text-3xl font-bold">19</p>
              <p className="text-lg">SPONSORS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Extra;
