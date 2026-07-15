import ParallaxImage from "./ParallaxImage";

type Testimonial = {
  name: string;
  quote: string;
  photo: string;
};

export default function TestimonialCard({
  name,
  quote,
  photo,
}: Testimonial) {
  return (
    <div>
      <ParallaxImage
        src={photo}
        alt=""
        className="h-72 w-full sm:h-96"
        strength={30}
      />

      <div className="bg-primary-light px-6 py-6 sm:px-8">
        <p className="text-lg font-semibold leading-relaxed text-white">
          &ldquo;{quote}&rdquo;
        </p>
      </div>

      <p className="mt-4 text-sm font-bold text-muted">{name}</p>
    </div>
  );
}
