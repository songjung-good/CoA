import { forwardRef } from "react";
import Image from "next/image";
import tw from "tailwind-styled-components";

interface ServiceIntroduceVerticalProps {
  content: Record<string, any>;
  image: string;
  style: React.CSSProperties;
}

const ServiceIntroduceVertical = forwardRef<
  HTMLDivElement,
  ServiceIntroduceVerticalProps
>(({ content, image, style }, ref) => {
  return (
    <Service ref={ref} style={style}>
      <div className="w-full max-w-2xl flex flex-col justify-center items-center rounded-2xl border shadow-lg bg-white hover:border-appBlue1 py-5 px-4">
        <div className="w-full h-72 relative flex justify-center items-center">
          <Image
            src={image}
            fill
            style={{ objectFit: "cover" }}
            alt="analysis"
          />
        </div>
        <div className="w-full flex flex-col justify-center items-center py-5 px-4 text-center">
          <p className="text-xl mb-2">{content.title}</p>
          <p className="whitespace-pre-wrap mb-2 text-sm">
            {content.description}
          </p>
          <div className="flex flex-wrap justify-center">
            {content.hashtags.map((tag: string, key: string) => (
              <p
                key={key}
                className="border-2 mr-2 mb-2 px-2 py-1 rounded-lg text-sm hover:bg-appGrey1"
              >
                {tag}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Service>
  );
});

const Service = tw.div`
  flex flex-col items-center justify-center w-full h-screen px-4
`;

export default ServiceIntroduceVertical;
