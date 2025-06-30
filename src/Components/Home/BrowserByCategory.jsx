import React from 'react';

const categories = [
  {
    title: 'Travel & Tourism',
    events: 7,
    eventTypes: ['Sightseeing', 'Adventure Tours', 'Cruises'],
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=64&q=80', // travel scenery
  },
  {
    title: 'Sports & Fitness',
    events: 4,
    eventTypes: ['Marathons', 'Yoga Sessions', 'Fitness Challenges'],
    image: 'https://i.ibb.co/ZzTHVNML/happy-business-colleagues-serving-themselves.jpg', // running shoes
  },
  {
    title: 'Industrial Engineering',
    events: 4,
    eventTypes: ['Workshops', 'Conferences', 'Networking'],
    image: 'https://i.ibb.co/bRdH4ypn/faq-boy-with-logos-BVjkzf-t.png', // factory machinery
  },
  {
    title: 'Health & Wellness',
    events: 4,
    eventTypes: ['Meditation', 'Wellness Retreats', 'Health Checkups'],
    image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=64&q=80', // wellness meditation
  },
  {
    title: 'Food & Drinks',
    events: 6,
    eventTypes: ['Food Festivals', 'Cooking Classes', 'Wine Tasting'],
    image: 'https://i.ibb.co/JR5zVssL/laptop-girl-gi-Hg-UAn-M.png', // delicious food
  },
  {
    title: 'Fashion & Beauty',
    events: 4,
    eventTypes: ['Fashion Shows', 'Makeup Tutorials', 'Styling Workshops'],
    image: 'https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=64&q=80', // fashion model
  },
];

const BrowserByCategory = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-rose-50 to-pink-100">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h4 className="text-rose-500 font-bold text-xl mb-2 uppercase tracking-wide">Category</h4>
        <h2 className="text-4xl text-gray-800 font-extrabold mb-12">
          Browse By <span className="text-rose-600">Category</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="bg-white border border-rose-100 rounded-2xl p-6 hover:shadow-lg hover:scale-[1.03] transition-all duration-300 flex flex-col items-center text-center"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-16 h-16 mb-4 object-cover rounded-full"
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{cat.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{cat.events} Event(s)</p>
              <p className="text-xs text-rose-600 font-medium">
                {cat.eventTypes.join(' • ')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowserByCategory;
