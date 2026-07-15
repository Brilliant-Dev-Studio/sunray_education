import Image from "next/image";

export default function Logo({
  crestClassName = "h-10 sm:h-14",
}: {
  crestClassName?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/letterLogo.png"
        alt="Education Group Of Sunray Myanmar"
        width={257}
        height={255}
        className={`w-auto rounded-md transition-all duration-350 ease-out ${crestClassName}`}
        priority
      />
      <p className="whitespace-nowrap font-serif leading-none text-foreground">
        <span className="text-xl font-bold sm:text-2xl">Sunray</span>{" "}
        <span className="text-xs font-medium sm:text-sm">
          Education Group Myanmar
        </span>
      </p>
    </div>
  );
}
