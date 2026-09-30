import React from "react";
import { Quote } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useGetCmsContentQuery } from "../../redux/api/apiSlice";
import "swiper/css";
import "swiper/css/pagination";

const FALLBACK_TESTIMONIALS = [
  {
    id: "t1",
    quote:
      "Bet Snipe stopped me from chasing every single game. I lock in a few edges, ride with a plan, and live with the results. Way less chaos.",
    author: "User Alias",
    role: "Verified Member",
  },
  {
    id: "t2",
    quote:
      "The 20-minute alerts before tip have saved me from bad numbers more times than I can count. I treat it like my second set of eyes.",
    author: "User Alias",
    role: "Verified Member",
  },
];

const TestimonialCard = ({ item }) => (
  <div className="relative rounded-2xl bg-[#0f141b]/90 border border-white/10 p-5 sm:p-6 lg:p-7 flex flex-col justify-between hover:border-[#00E676]/40 transition-all duration-300 shadow-xl h-full">
    <div className="mb-4 sm:mb-5">
      <Quote className="w-7 h-7 sm:w-8 sm:h-8 text-[#00E676]/30 mb-3" />
      <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal italic">
        &ldquo;{item.quote}&rdquo;
      </p>
    </div>

    <div className="flex items-center gap-2.5 pt-4 border-t border-white/10">
      <div className="w-8 h-8 rounded-full bg-[#17202b] border border-[#00E676]/30 flex items-center justify-center font-bold text-xs text-[#00E676]">
        BS
      </div>
      <div>
        <div className="text-xs sm:text-sm font-bold text-white">
          — {item.author}
        </div>
        <div className="text-[10px] sm:text-xs text-gray-400 font-medium">
          {item.role}
        </div>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  const { data: cmsRes } = useGetCmsContentQuery();

  const allTestimonials =
    cmsRes?.data?.testimonials && cmsRes.data.testimonials.length > 0
      ? cmsRes.data.testimonials
      : FALLBACK_TESTIMONIALS;

  return (
    <section
      id="results"
      className="py-8 sm:py-10 md:py-12 relative overflow-hidden"
    >
      <div className="section-padding-x max-w-[1600px] mx-auto">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <span className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-[#00E676] block mb-1.5">
            REAL IMPACT
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
            Built for people who actually bet.
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl leading-relaxed">
            Bet Snipe is designed for bettors who already take this seriously
            and want a sharper, more disciplined process instead of pure
            guessing.
          </p>
        </div>

        {/* Swiper Testimonials */}
        <div className="mb-6">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true }}
            loop={allTestimonials.length > 2}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 2 },
            }}
            className="testimonials-swiper !pb-10"
          >
            {allTestimonials.map((item) => (
              <SwiperSlide key={item.id} className="h-auto">
                <TestimonialCard item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Disclaimer */}
        <p className="text-[11px] sm:text-xs text-gray-400 max-w-2xl leading-relaxed">
          Testimonials are illustrative only and do not guarantee similar
          outcomes. Betting results vary and always involve risk.
        </p>
      </div>

      <style>{`
        .testimonials-swiper .swiper-pagination-bullet {
          background: rgba(255,255,255,0.2);
          opacity: 1;
          width: 8px;
          height: 8px;
        }
        .testimonials-swiper .swiper-pagination-bullet-active {
          background: #00E676;
          box-shadow: 0 0 8px rgba(0,230,118,0.6);
          width: 24px;
          border-radius: 4px;
        }
        .testimonials-swiper .swiper-slide {
          height: auto;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
