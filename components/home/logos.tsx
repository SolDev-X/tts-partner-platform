"use client";

import Marquee from "react-fast-marquee";
import Image from "next/image";
import {cn} from "@/lib/utils";

type LogosSimpleStaticLogo = Logo & {
  href?: string;
};
interface Logo {
  src: string;
  alt: string;
  srcDark?: string;
  className?: string;
}

interface LogosSimpleStaticProps {
  logos: LogosSimpleStaticLogo[];
  className?: string;
}

type Props = Partial<LogosSimpleStaticProps>;

const defaultProps: LogosSimpleStaticProps = {
  logos: [
    {
      src: "/logos/amazon.svg",
      alt: "Amazon",
      className: "h-7 w-auto",
    },
    {
      src: "/logos/ebay.svg",
      alt: "eBay",
      className: "h-7 w-auto",
    },
    {
      src: "/logos/shopee.svg",
      alt: "Shopee",
      className: "h-7 w-auto",
    },
    {
      src: "/logos/lazada.svg",
      alt: "Lazada",
      className: "h-7 w-auto",
    },
    {
      src: "/logos/temu.svg",
      alt: "Temu",
      className: "h-7 w-auto invert",
    },
    {
      src: "/logos/shein.svg",
      alt: "SHEIN",
      className: "h-7 w-auto",
    },
    {
      src: "/logos/aliexpress.svg",
      alt: "AliExpress",
      className: "h-7 w-auto",
    },
    {
      src: "/logos/tiktokshop.png",
      alt: "TikTok Shop",
      className: "h-7 w-auto",
    },
    {
      src: "/logos/shopify.svg",
      alt: "Shopify",
      className: "h-7 w-auto",
    },
    {
      src: "/logos/rakuten.svg",
      alt: "Rakuten",
      className: "h-7 w-auto",
    },
    {
      src: "/logos/yahoo.svg",
      alt: "Yahoo",
      className: "h-7 w-auto",
    },
  ],
};

const Logos = (props: Props) => {
  const {logos, className} = {
    ...defaultProps,
    ...props,
  };

  return (
    <section className={cn("py-5", className)}>
      <div className="mt-8 lg:mt-12">
        <Marquee gradient gradientWidth={64} autoFill pauseOnHover speed={60}>
          {logos.map((logo, index) => (
            <div
              key={`${logo.src}-${index}`}
              className="mx-8 flex aspect-3/1 w-28 items-center justify-center sm:w-32 lg:mx-10"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={112}
                height={40}
                className="h-full w-full object-contain dark:invert"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default Logos;
