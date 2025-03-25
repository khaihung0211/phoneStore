import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerImages = [
    `${import.meta.env.VITE_API_URL_IMG}/uploads/banner/banner2.png`,
    `${import.meta.env.VITE_API_URL_IMG}/uploads/banner/banner3.png`,
    `${import.meta.env.VITE_API_URL_IMG}/uploads/banner/banner4.png`,
    `${import.meta.env.VITE_API_URL_IMG}/uploads/banner/banner5.png`,
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % bannerImages.length);
    }, 5000); // Thay đổi slide mỗi 5 giây

    return () => clearInterval(interval);
  }, []);

  // Chuyển đến slide trước
  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? bannerImages.length - 1 : prevSlide - 1
    );
  };

  // Chuyển đến slide tiếp theo
  const nextSlide = () => {
    setCurrentSlide((prevSlide) =>
      (prevSlide + 1) % bannerImages.length
    );
  };

  // Chuyển đến slide cụ thể
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="w-full flex justify-center items-center">
      {/* Container căn giữa với width 60% */}
      <div className="w-[60%] relative overflow-hidden rounded-lg shadow-xl">
        {/* Container cho các slides */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {bannerImages.map((image, index) => (
            <div key={index} className="min-w-full">
              <img
                src={image}
                alt={`Banner ${index + 1}`}
                className="w-full h-auto object-cover"
                width="778"
                height="410"
              />
            </div>
          ))}
        </div>

        {/* Nút điều hướng trái/phải */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 backdrop-blur-sm transition-all"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 backdrop-blur-sm transition-all"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* Chỉ báo slide (dots) */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${currentSlide === index
                  ? 'bg-white scale-110'
                  : 'bg-white/50 hover:bg-white/70'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
