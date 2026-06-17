import React from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css";
import { Mousewheel, Navigation } from "swiper/modules";
import { FaStar } from "react-icons/fa";

function HomeSectionCard({ data, sectionName, category }) {
  const navigate = useNavigate()

  const handleCardClick = (item) => {
    // ✅ Save the clicked product and navigate to product details
    sessionStorage.setItem('selectedProduct', JSON.stringify(item))
    navigate('/product-details')
  }

  const handleSectionClick = () => {
    // ✅ Save category so Product page can filter by it
    sessionStorage.setItem('selectedCategory', category)
    navigate('/product')
  }

  return (
    <div className="w-full px-4 py-10 bg-gray-100 group relative">

      {/* ✅ Section heading is clickable — goes to filtered product page */}
      <div className="flex items-center justify-between py-5">
        <h2 className="text-2xl font-semibold text-gray-800">{sectionName}</h2>
        <button
          onClick={handleSectionClick}
          className="text-sm text-indigo-600 font-medium hover:underline underline-offset-2"
        >
          View All →
        </button>
      </div>

      <Swiper
        modules={[Navigation, Mousewheel]}
        navigation={true}
        spaceBetween={20}
        loop={true}
        grabCursor={true}
        breakpoints={{
          320:  { slidesPerView: 1 },
          640:  { slidesPerView: 2 },
          768:  { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
        className="custom-swiper"
      >
        {data.map((item, i) => (
          <SwiperSlide key={`${item.id}-${i}`}>

            {/* ✅ Whole card is clickable */}
            <div
              onClick={() => handleCardClick(item)}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:-translate-y-2 hover:shadow-2xl duration-300 flex flex-col cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-56 object-cover object-top"
              />

              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-base font-bold text-gray-800 truncate">
                    {item.title}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {item.desc}
                  </p>

                  {/* Rating */}
                  {item.rating && (
                    <div className="flex items-center gap-1 mt-2">
                      <FaStar className="text-yellow-400 text-xs" />
                      <span className="text-sm font-semibold">{item.rating}</span>
                      <span className="text-gray-400 text-xs">({item.reviews})</span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="text-base font-bold text-gray-900">{item.price}</span>
                    {item.oldPrice && (
                      <span className="text-xs text-gray-400 line-through">{item.oldPrice}</span>
                    )}
                    {item.discount && (
                      <span className="text-xs font-semibold text-green-600">{item.discount}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        .custom-swiper .swiper-button-next,
        .custom-swiper .swiper-button-prev {
          background: white;
          width: 32px;
          height: 32px;
          border-radius: 9999px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
          opacity: 0;
          transition: 0.3s;
          color: #4f46e5;
        }
        .custom-swiper:hover .swiper-button-next,
        .custom-swiper:hover .swiper-button-prev {
          opacity: 1;
        }
        .custom-swiper .swiper-button-next::after,
        .custom-swiper .swiper-button-prev::after {
          font-size: 14px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}

export default HomeSectionCard;