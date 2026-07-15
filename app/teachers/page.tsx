import Image from "next/image";
import Header from "../Header";
import TeacherCard from "../TeacherCard";
import Reveal from "../Reveal";

const teachers = [
  {
    name: "U Naing Wai Yan",
    role: "Director",
    photo: "/Teachers/dictor.jpg",
  },
  {
    name: "U Htet Wai Yan Htun",
    role: "Lecturer",
    photo: "/Teachers/lecture.jpg",
  },
  {
    name: "Prof. Dr Win Bo",
    role: "Lecturer",
    photo: "/Teachers/lecturer.jpg",
  },
  {
    name: "Dr. Zin Myo",
    role: "Lecturer",
    photo: "/Teachers/zinmyo.jpg",
  },
  {
    name: "Hsu Thinzar Htun",
    role: "Lecturer",
    photo: "/Teachers/hsuThinzar.jpg",
  },
  {
    name: "U Shane Shane Aung",
    role: "Lecturer",
    photo: "/Teachers/shanshan.webp",
  },
  {
    name: "Daw Khaing Thinzar Myo",
    role: "Lecturer",
    photo: "/Teachers/khaing.jpg",
  },
];

export default function TeachersPage() {
  return (
    <>
      <Header />

      <section className="relative flex h-[50vh] min-h-[380px] w-full items-center justify-center overflow-hidden">
        <Image
          src="/HeroImages/leder2.avif"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary-light">
            Faculty
          </p>
          <h1 className="mt-5 font-sans text-4xl font-bold leading-tight text-white sm:text-6xl">
            The Educators Behind{" "}
            <span className="text-primary-light">Sunray</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/80">
            A faculty of experienced scholars and mentors, dedicated to
            academic excellence and the growth of every student.
          </p>
          <hr className="mx-auto mt-10 w-16 border-t-2 border-primary-light" />
        </div>
      </section>

      <Reveal>
        <div className="mx-auto mt-16 max-w-384 px-4 text-center sm:px-12">
          <p className="text-sm font-bold tracking-wide text-primary-light">
            MEET OUR TEAM
          </p>
          <h2 className="mt-4 font-sans text-3xl font-semibold leading-tight text-foreground sm:text-5xl">
            Our Dedicated <span className="text-primary-light">Faculty</span>
          </h2>
        </div>
      </Reveal>

      <section className="mx-auto mt-12 max-w-384 px-3 pb-28 sm:px-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.map((teacher, i) => (
            <Reveal key={teacher.name} delay={(i % 3) * 0.1}>
              <TeacherCard {...teacher} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
