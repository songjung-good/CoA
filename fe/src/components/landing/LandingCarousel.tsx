import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

export default function LandingCarousel() {
  const style = {
    height: "calc(90vh)",
    objectFit: "cover" as "cover", // 'cover'를 ObjectFit 타입으로 간주합니다.
    width: "100%",
    opacity: 0.25,
  };

  return (
    <div className="w-full h-1/2">
      <Swiper
        spaceBetween={50}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        navigation={false}
        modules={[Autoplay, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img
            src="/image/carousel/carousel1.jpg"
            alt="Carousel 1"
            style={style}
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="/image/carousel/carousel2.jpg"
            alt="Carousel 2"
            style={style}
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="/image/carousel/carousel3.jpg"
            alt="Carousel 3"
            style={style}
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="/image/carousel/carousel4.jpg"
            alt="Carousel 4"
            style={style}
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="/image/carousel/carousel5.jpg"
            alt="Carousel 5"
            style={style}
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
