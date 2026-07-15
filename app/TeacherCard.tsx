import ParallaxImage from "./ParallaxImage";

type Teacher = {
  name: string;
  role: string;
  photo: string;
  credentials?: string;
};

export default function TeacherCard({
  name,
  role,
  photo,
  credentials,
}: Teacher) {
  return (
    <div className="group mx-auto w-81">
      <ParallaxImage
        src={photo}
        alt={name}
        className="h-108 w-81"
        imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        strength={20}
      />

      <div className="mt-5 text-center">
        <p className="text-base font-bold uppercase tracking-wide text-foreground">
          {name}
        </p>
        <p className="mt-1 text-sm text-muted">{role}</p>
        {credentials && (
          <p className="mt-1 text-sm text-muted">{credentials}</p>
        )}
      </div>
    </div>
  );
}
