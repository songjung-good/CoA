import { forwardRef } from "react";
import Image from "next/image";
import tw from "tailwind-styled-components";
import { useState, useEffect, useRef } from "react";

interface ServiceIntroduceLeftProps {
  content: string;
  image: string;
}

const ServiceIntroduceLeft = forwardRef<
  HTMLDivElement,
  ServiceIntroduceLeftProps
>(({ content, image }, ref: any) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.4 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);
  return (
    <Service
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateX(0)" : "translateX(-50%)",
        transition: "opacity 1s ease-out, transform 0.5s ease-in-out",
        overflow: "hidden",
      }}
    >
      <div className="flex w-1/3 h-1/2 relative justify-center items-center">
        <Image src={image} layout="fill" objectFit="cover" alt="analysis" />
      </div>
      <p className="flex w-1/2 h-60 relative justify-center items-center">
        {content}
      </p>
    </Service>
  );
});

export default ServiceIntroduceLeft;

const Service = tw.div`
  flex my-10 justify-between items-center mx-10 h-screen overflow-hidden
`;
