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

      <Reveal>
        <section className="px-6 pb-4 pt-16 text-center sm:px-12 sm:pt-28">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-light">
            Faculty
          </p>
          <h1 className="mt-5 font-serif text-4xl leading-tight text-foreground sm:text-6xl">
            The Educators Behind{" "}
            <span className="text-primary-light">Sunray</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted">
            A faculty of experienced scholars and mentors, dedicated to
            academic excellence and the growth of every student.
          </p>
          <hr className="mx-auto mt-10 w-16 border-t-2 border-primary-light" />
        </section>
      </Reveal>

      <section className="mx-auto mt-16 max-w-384 px-6 pb-28 sm:px-12">
        <div className="grid grid-cols-1 gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
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
