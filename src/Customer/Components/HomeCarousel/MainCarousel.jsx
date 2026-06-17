import React from 'react'

import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules'

function MainCarousel() {
  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, Autoplay]}
      spaceBetween={8}
      slidesPerView={1}
      speed={700}
      navigation={false}  // to disable buttons
        loop={true}   //to prevent sudden back to 1st slide
      // pagination={{ clickable: true }}
      // scrollbar={{ draggable: true }}
      autoplay={{ delay: 2000 ,
         disableOnInteraction: false,   //so autoplay continues even after user swipes manually
      }
    }
    >
      <SwiperSlide>
        <img src="/Banarasi01.png" alt=""  style={{height:"auto", width:"100%", objectFit:"cover"}} />
      </SwiperSlide>
       <SwiperSlide>
        <img src="/Sareesets.png" alt=""  style={{height:"auto", width:"100%", objectFit:"cover"}} />
      </SwiperSlide>
       <SwiperSlide>
        <img src="/Lehengas.png" alt=""  style={{height:"auto", width:"100%", objectFit:"cover"}} />
      </SwiperSlide>
       <SwiperSlide>
        <img src="/Mens.png" alt=""  style={{height:"auto", width:"100%", objectFit:"cover"}} />
      </SwiperSlide>

      <SwiperSlide>
        <img src="/Electronics2.jpg" alt=""  style={{height:"auto", width:"100%", objectFit:"cover"}} />
      </SwiperSlide>

      <SwiperSlide>
        <img src="/download.jpeg" alt="" style={{height:"auto", width:"100%", objectFit:"cover"}} />
      </SwiperSlide>
    </Swiper>
  )
}

export default MainCarousel