import { forwardRef } from "react";
import Image from "next/image";
import tw from "tailwind-styled-components";

interface ServiceIntroduceVerticalProps {
  content: string;
  image: string;
  style: React.CSSProperties;
}

const ServiceIntroduceVertical = forwardRef<
  HTMLDivElement,
  ServiceIntroduceVerticalProps
>(({ content, image, style }, ref) => {
  return (
    <Service ref={ref} style={style}>
      <div className="flex w-1/2 h-72 relative justify-center items-center">
        <Image src={image} layout="fill" objectFit="cover" alt="analysis" />
      </div>
      <p className="flex w-1/2 h-60 relative justify-center items-center">
        {content}
      </p>
    </Service>
  );
});

const Service = tw.div`
  flex flex-col items-center w-full relative mb-20 mt-6
`;

export default ServiceIntroduceVertical;
