import ParallaxImage from "./ParallaxImage";

type Teacher = {
  name: string;
  role: string;
  photo: string;
};

export default function TeacherCard({ name, role, photo }: Teacher) {
  return (
    <div className="group">
      <div className="border border-foreground/20 p-2">
        <div className="border border-foreground/10 p-2">
          <ParallaxImage
            src={photo}
            alt={name}
            className="h-72 w-full sm:h-80"
            imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            strength={25}
          />
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="font-serif text-2xl text-foreground">{name}</p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary-light">
          {role}
        </p>
      </div>
    </div>
  );
}
