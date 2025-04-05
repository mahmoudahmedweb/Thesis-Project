import React from "react";
import { assets, dummyTestimonial } from "../../assets/assets";

const TestimonialSection = () => {
  return (
    <div className="py-20 px-8 md:px-12 lg:px-24 bg-gray-50 w-full">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          What Our Learners Say
        </h2>
        <p className="text-xl text-gray-600 leading-relaxed">
          Discover how our platform has transformed the lives of our learners.
          Hear their stories of growth, success, and inspiration.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-8 mt-16">
        {dummyTestimonial.map((testimonial, index) => (
          <div
            className="w-full sm:w-1/2 lg:w-1/4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
            key={index}
          >
            <div className="p-6 flex-1">
              <div className="flex items-center gap-4">
                <img
                  className="h-14 w-14 rounded-full object-cover"
                  src={testimonial.image}
                  alt={testimonial.name}
                />
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    {testimonial.name}
                  </h1>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <img
                    className="h-5 w-5"
                    key={i}
                    src={
                      i < Math.floor(testimonial.rating)
                        ? assets.star
                        : assets.star_blank
                    }
                    alt="star"
                  />
                ))}
              </div>
              <p className="text-gray-700 mt-4 leading-relaxed">
                {testimonial.feedback}
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-100">
              <a
                href="#"
                className="inline-flex items-center text-white bg-red-600 hover:bg-red-700 font-medium py-2 px-6 rounded-full transition-colors group"
              >
                Read Full Story
                <span className="ml-2 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialSection;
