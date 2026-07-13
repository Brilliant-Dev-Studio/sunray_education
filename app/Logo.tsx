import Image from "next/image";

export default function Logo({
  crestClassName = "h-10 sm:h-14",
}: {
  crestClassName?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/logo-crest.png"
        alt="Education Group Of Sunray Myanmar"
        width={236}
        height={281}
        className={`w-auto ${crestClassName}`}
        priority
      />
      <div className="flex items-center gap-3 border-l border-foreground/40 pl-3">
        <p className="font-serif text-sm italic leading-tight text-foreground sm:text-base">
          Education Group Of
          <br />
          Sunray
          <br />
          Myanmar
        </p>
      </div>
    </div>
  );
}
