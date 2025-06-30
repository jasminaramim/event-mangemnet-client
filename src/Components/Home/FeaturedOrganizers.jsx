import React from "react";

const FeaturedOrganizers = () => {
  const organizers = [
    {
      name: "Healthcare Center",
      events: 3,
      location: "Manitoba, Canada",
      icon: "https://images.unsplash.com/photo-1579154204601-01588f351e85?auto=format&fit=crop&w=100&q=60",
    },
    {
      name: "Info Connect",
      events: 5,
      location: "Iowa, United States",
      icon: "https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&w=100&q=60",
    },
    {
      name: "Enterprising Women",
      events: 4,
      location: "British Columbia, Canada",
      icon: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=60",
    },
    {
      name: "Key Media",
      events: 2,
      location: "Russia",
      icon: "https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?auto=format&fit=crop&w=100&q=60",
    },
    {
      name: "Sigma Music",
      events: 6,
      location: "Danube, Serbia",
      icon: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=100&q=60",
    },
    {
      name: "Worldex Company",
      events: 3,
      location: "Georgia, United States",
      icon: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=60",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10 text-gray-800 leading-tight">
          <span className="text-pink-600">Organizers</span>
          <br />
          Featured Organizers
        </h2>

        <div className="grid grid-cols-1 p-4 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {organizers.map((organizer, index) => (
            <div
              key={index}
              className="border rounded-2xl p-2 bg-white border-pink-100 shadow-sm hover:shadow-lg hover:scale-[1.02] transition duration-300 ease-in-out"
            >
              <div className="flex items-center space-x-5">
                <img
                  src={organizer.icon}
                  alt={`${organizer.name} logo`}
                  className="w-14 h-14 object-cover rounded-xl border border-gray-200"
                />
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
                    {organizer.name}
                  </h3>
                  <p className="text-sm text-gray-600">📅 {organizer.events} Event(s)</p>
                  <p className="text-sm text-gray-500">📍 {organizer.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedOrganizers;
