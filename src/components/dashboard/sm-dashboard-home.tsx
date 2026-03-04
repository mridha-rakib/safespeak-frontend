import Image from "next/image";
import Link from "next/link";
import sphereAdv from "@/assets/sphere-adv.svg?url";
import bottomLeft from "@/assets/bottomLeftSM.svg?url";
import bottomRight from "@/assets/bottomRightSM.svg?url";
import topLeftSM from "@/assets/topLeftSM.svg?url";
import topRightSM from "@/assets/topRightSM.svg?url";

function SMDasboardHome() {
  return (
    <div className="mx-auto w-full px-4 pb-5 pt-2 lg:hidden">
      <div className="relative grid w-full grid-cols-2 gap-4 gap-y-4">
          <article className="relative aspect-[172/230] overflow-visible">
            <Image
              src={topLeftSM}
              alt="Domestic violence card"
              fill
              className="object-contain"
            />
          </article>

          <article className="relative w-full aspect-[172/230] overflow-visible">
            <Image
              src={topRightSM}
              alt="Racial abuse card"
              fill
              className="object-contain"
            />
          </article>

          <article className="relative aspect-[172/230] overflow-visible">
            <Image
              src={bottomLeft}
              alt="Cyber scam card"
              fill
              className="object-cover"
            />
          </article>

          <article className="relative aspect-[172/230] overflow-visible">
            <Image
              src={bottomRight}
              alt="Migrant challenges card"
              fill
              className="object-cover"
            />
          </article>

        <Link
          href={{
            pathname: "/dashboard",
            query: { view: "assistant" },
          }}
          className="absolute left-1/2 top-[30%] z-20 h-[40%] w-[55%] -translate-x-1/2 rounded-full"
          aria-label="Report an incident"
        >
          <span className="absolute inset-0" />
          <span className="absolute inset-[14px] overflow-hidden rounded-full">
            <Image
              src={sphereAdv}
              alt="Report an incident"
              fill
              className="object-cover"
            />
          </span>
        </Link>
      </div>
    </div>
  );
}

export default SMDasboardHome;
