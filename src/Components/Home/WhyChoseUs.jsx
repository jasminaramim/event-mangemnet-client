import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const sections = [
  {
    title: "Trusted Event Management",
    description:
      "We provide reliable event planning services backed by industry professionals. From corporate summits to weddings, our team ensures a smooth experience.",
    image: "https://i.ibb.co/7JkVVHgB/wedding-planner-concept-illustration.png",
    icon: "🎯",
  },
  {
    title: "Affordable & Flexible Packages",
    description:
      "Whether you're planning a small gathering or a large-scale festival, our pricing is transparent and customizable to your needs.",
    image: "https://i.ibb.co/YFP1vB61/9000463-4067780.jpg",
    icon: "💸",
  },
  {
    title: "Customer Satisfaction Guaranteed",
    description:
      "We prioritize your happiness and strive for 100% customer satisfaction. Let us handle the stress while you enjoy your event.",
    image: "https://i.ibb.co/Z1pftGk6/10297056-4400254.jpg",
    icon: "👍",
  },
];

const WhyChoseUs = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration
      once: true, // only animate once
      offset: 100, // offset (in px) from the original trigger point
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-10" data-aos="fade-up">
        Why Choose <span className="text-red-600">Us</span>
      </h2>

      {sections.map((section, index) => (
        <div
          key={index}
          className={`flex flex-col-reverse lg:flex-row ${
            index % 2 === 1 ? 'lg:flex-row-reverse' : ''
          } items-center gap-8`}
        >
          {/* Image */}
          <div
            className="w-full lg:w-1/2"
            data-aos={index % 2 === 1 ? 'fade-left' : 'fade-right'}
          >
            <img
              src={section.image}
              alt={section.title}
              className="rounded-lg w-full object-cover"
            />
          </div>

          {/* Content */}
          <div
            className="w-full lg:w-1/2 space-y-4"
            data-aos={index % 2 === 1 ? 'fade-right' : 'fade-left'}
          >
            <div className="text-5xl">{section.icon}</div>
            <h3 className="text-2xl font-bold text-gray-800">{section.title}</h3>
            <p className="text-gray-600">{section.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WhyChoseUs;
