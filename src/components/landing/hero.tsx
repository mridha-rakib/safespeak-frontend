import Image from "next/image";

import androidLink from "@/assets/android-link.svg";
import appleLink from "@/assets/apple-link.svg";
import indicator from "@/assets/indicator.svg";
import phoneLeft from "@/assets/Rectangle.svg?url";
import phoneRight from "@/assets/Rectangle-2.svg?url";
import qrCode from "@/assets/qrcode.svg";
import sphere from "@/assets/sphere.svg?url";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#01579B]">
      <div className="pointer-events-none absolute inset-x-[-30%] bottom-[-46%] h-[95%] sm:inset-x-[-20%] sm:bottom-[-42%] lg:inset-x-[-12%] lg:bottom-[-35%] xl:hidden">
        <Image
          src={sphere}
          alt="SafeSpeak sphere background"
          fill
          priority
          sizes="100vw"
          className="object-contain object-bottom"
        />
      </div>

      <div
        className="pointer-events-none absolute hidden xl:block"
        style={{
          width: "1039px",
          height: "1039px",
          top: "339.58px",
          left: "88px",
        }}
      >
        <Image
          src={sphere}
          alt="SafeSpeak sphere background"
          width={1039}
          height={1039}
          priority
          className="h-full w-full object-contain opacity-80"
        />
      </div>

      <div className="relative z-10 w-full px-4 pb-16 pt-6 sm:px-6 sm:pb-20 md:px-8 lg:px-10 lg:pb-24 xl:min-h-[906px] xl:px-[150px] 2xl:pb-28">
        <div className="grid items-center gap-10 md:grid-cols-[1fr,0.95fr] lg:gap-12 2xl:gap-16">
          <div className="space-y-4">
            <h1 className="max-w-[860px] text-[34px] font-extrabold uppercase leading-[1.25] tracking-[-0.5px] text-white sm:text-[40px] sm:leading-[1.35] xl:text-[48.6px] xl:leading-[84px]">
              <span className="text-[var(--safe-orange)]">AN APP</span>{" "}
              <span>THAT TALKS FOR YOU</span>
              <br />
              <span>EMPOWERS YOU</span>
            </h1>
            <p className="text-sm font-semibold text-white/85 sm:text-base">
              Download the app now from our iOS & Android store.
            </p>

            <div className="flex flex-col gap-4 pt-2 sm:gap-5">
              <div className="flex flex-col gap-2.5">
                <Image
                  src={indicator}
                  alt="Download indicator arrow"
                  className="h-9 w-auto sm:h-11"
                />
                <Image
                  src={appleLink}
                  alt="Download on the App Store"
                  className="h-11 w-auto sm:h-[50px]"
                />
                <Image
                  src={androidLink}
                  alt="Get it on Google Play"
                  className="h-11 w-auto sm:h-[50px]"
                />
              </div>
              <Image src={qrCode} alt="SafeSpeak QR" className="h-14 w-auto sm:h-[60px]" />
            </div>
          </div>

          <div className="relative flex justify-center md:justify-end">
            <div className="flex items-end gap-2 sm:gap-4 lg:gap-6 drop-shadow-[var(--shadow-card)]">
              <Image
                src={phoneLeft}
                alt="SafeSpeak app preview"
                width={308}
                height={640}
                className="h-[290px] w-auto sm:h-[360px] md:h-[430px] lg:h-[500px] 2xl:h-[560px]"
                priority
              />
              <Image
                src={phoneRight}
                alt="SafeSpeak voice preview"
                width={308}
                height={640}
                className="h-[300px] w-auto sm:h-[370px] md:h-[440px] lg:h-[520px] 2xl:h-[580px]"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
