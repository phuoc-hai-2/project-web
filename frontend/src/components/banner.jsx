import { useProducts } from "../hooks/useProduct";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
const Banner = () => {
  const products = useProducts();
  return (
    <>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={4}
        navigation
        autoplay={{ delay: 3000 }}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {products.map((item, index) => (
          <SwiperSlide key={`slide-${index}`}>
            <img src={item.image} alt="banner" className="banner-img" />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};
export default Banner;
