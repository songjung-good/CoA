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
      <div className="w-4/5 flex flex-col justify-center items-center rounded-2xl border shadow-lg bg-white hover:border-appBlue1 py-5">
        <div className="flex w-2/3 max-w-sm h-72 relative justify-center items-center">
          <Image src={image} layout="fill" objectFit="cover" alt="analysis" />
        </div>
        <p className="flex w-1/2 h-60 relative justify-center items-center">
          {content}
        </p>
      </div>
    </Service>
  );
});

const Service = tw.div`
  flex flex-col items-center justify-center w-full h-screen relative
`;

export default ServiceIntroduceVertical;
