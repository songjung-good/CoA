import { forwardRef } from "react";
import Image from "next/image";
import tw from "tailwind-styled-components";
import { useState, useEffect, useRef } from "react";

interface ServiceIntroduceRightProps {
  content: Record<string, any>;
  image: string;
}

const ServiceIntroduceRight = forwardRef<
  HTMLDivElement,
  ServiceIntroduceRightProps
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
        transform: isVisible ? "translateX(0)" : "translateX(50%)",
        transition: "opacity 1s ease-out, transform 0.5s ease-in-out",
        overflow: "hidden",
      }}
    >
      <div className="w-1/3 flex flex-col justify-center items-center py-5 px-10 text-center border bg-white min-w-[350px] min-h-[472.5px] rounded-lg hover:border-appBlue2 shadow-lg">
        <p className="text-3xl mb-2">{content.title}</p>
        <p className="whitespace-pre-wrap mb-2">{content.description}</p>
        <div className="flex flex-wrap justify-center">
          {content.hashtags.map((tag: string, key: string) => (
            <p
              key={key}
              className="border-2 mr-2 mb-2 px-2 py-1 rounded-lg hover:bg-appGrey1"
            >
              {tag}
            </p>
          ))}
        </div>
      </div>
      <div className="flex w-1/2 h-1/2 relative justify-center items-center">
        <Image src={image} layout="fill" objectFit="cover" alt="analysis" />
      </div>
    </Service>
  );
});

export default ServiceIntroduceRight;

const Service = tw.div`
  flex my-10 justify-around items-center mx-32 h-screen overflow-hidden
`;
