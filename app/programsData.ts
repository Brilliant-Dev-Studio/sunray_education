export type Program = {
  title: string;
  slug: string;
  audience: string;
  syllabus: string;
  use: string;
};

export type Category = {
  title: string;
  slug: string;
  shortLabel: string;
  description: string;
  programs: Program[];
};

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[()&]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const rawCategories: (Omit<Category, "programs"> & {
  programs: Omit<Program, "slug">[];
})[] = [
  {
    title: "Language & Communication Programs",
    slug: "language",
    shortLabel: "Language",
    description:
      "English, Japanese, and Chinese courses that build real speaking, writing, and cross-cultural communication confidence.",
    programs: [
      {
        title: "English For Communication Skill (Level 1)",
        audience:
          "Absolute beginners, students, or working adults with minimal English exposure who want to build basic conversational confidence.",
        syllabus:
          "Basic greeting formulas, everyday vocabulary, essential phonetics, self-introductions, and simple sentence structures (present simple).",
        use: "Breaks the barrier of speaking anxiety, enabling basic daily survival communication and establishing a foundation for advanced learning.",
      },
      {
        title: "English For Communication Skill (Level 2)",
        audience:
          "Elementary learners who understand very basic English but struggle to sustain a full conversation or use appropriate tenses.",
        syllabus:
          "Past and future descriptions, situational interactions (shopping, traveling, dining), vocabulary expansion, and social interactive speaking drills.",
        use: "Allows individuals to comfortably travel independently, interact with foreigners, and express clear opinions in social and basic professional environments.",
      },
      {
        title: "English For Communication Skill (Level 3)",
        audience:
          "Intermediate learners looking to refine their fluency, expand idioms, and engage in complex discussions or corporate interactions.",
        syllabus:
          "Debating modern topics, complex grammatical structures (conditionals, perfect tenses), presentation skills, and professional networking language.",
        use: "Prepares individuals for academic presentations, client handling, and career promotions in international organizations.",
      },
      {
        title: "Business English (Level 1)",
        audience:
          "Entry-level professionals, interns, and university graduates looking to transition smoothly into an English-speaking corporate workspace.",
        syllabus:
          "Professional emails, workplace telephone etiquette, office vocabulary, fundamental business terms, and polite professional phrasing.",
        use: "Enhances day-to-day office productivity, ensures polite corporate communication, and gives candidates an edge during job interviews.",
      },
      {
        title: "Business English (Level 2)",
        audience:
          "Mid-level executives, team leaders, and business owners who need to negotiate, pitch, and present ideas effectively.",
        syllabus:
          "Business presentation delivery, professional negotiation models, advanced reporting, cross-cultural corporate communication, and corporate meeting management.",
        use: "Enables professionals to secure global business partnerships, present data confidently to stakeholders, and manage international projects.",
      },
      {
        title: "Foundation of Written English",
        audience:
          "Students and employees who face difficulties with spelling, core punctuation, and building basic, grammatically flawless sentences.",
        syllabus:
          "Parts of speech, sentence mechanics (subject-verb agreement), basic paragraph structure, avoiding common grammatical errors, and sentence variety.",
        use: "Forms a foundation for all written work, ensuring academic papers and daily business messages are accurate and free from embarrassing mistakes.",
      },
      {
        title: "Mastering Written English",
        audience:
          "Academic researchers, content writers, and professionals who need to draft sophisticated reports, essays, or persuasive business documents.",
        syllabus:
          "Advanced essay writing models, cohesive devices, academic referencing style, vocabulary enhancement, and structural editing techniques.",
        use: "Enables the creation of compelling business proposals, academic publications, and precise legal or executive documentation.",
      },
      {
        title: "Basic Japanese Course (N5)",
        audience:
          "Anyone interested in Japanese language and culture, or planning to study/work in Japan.",
        syllabus:
          "Hiragana and Katakana characters, basic Kanji, elementary grammar, daily expressions, and basic listening exercises.",
        use: "Serves as the mandatory first milestone for passing the official JLPT N5 examination required for many academic or entry-level professional pathways in Japan.",
      },
      {
        title: "Basic Chinese Language Course (HSK 1 & HSK 2)",
        audience:
          "Beginners looking to capture opportunities in global businesses, international trade, or academic exchanges with Chinese-speaking regions.",
        syllabus:
          "Pinyin pronunciation, basic Hanzi characters, fundamental vocabulary for daily life, essential conversation structures, and preparing for official HSK testing standards.",
        use: "Creates enormous value in retail, logistics, international business negotiations, and opens doors to fully funded Chinese governmental academic scholarships.",
      },
    ],
  },
  {
    title: "Management & Leadership Programs",
    slug: "management",
    shortLabel: "Management",
    description:
      "Business, HR, marketing, and strategic leadership training for managers and entrepreneurs at every career stage.",
    programs: [
      {
        title: "Business Management",
        audience:
          "Aspiring managers, entrepreneurs, and students looking for a comprehensive blueprint on how businesses operate successfully.",
        syllabus:
          "Principles of planning, organizing, leading, and controlling; organizational culture, financial planning baselines, and business ethics.",
        use: "Provides foundational knowledge needed to confidently take over general supervisor roles or run an independent entrepreneurial venture efficiently.",
      },
      {
        title: "Chain Management (Supply Chain & Operations)",
        audience:
          "Logistics personnel, procurement specialists, retail coordinators, and business operations staff.",
        syllabus:
          "Inventory control strategies, vendor relationships, logistics, distribution channels, and optimizing operational workflows to minimize costs.",
        use: "Allows businesses to run with higher profit margins and equips employees to manage large-scale warehouse, retail, or import/export systems.",
      },
      {
        title: "Strategic Management and Leadership",
        audience:
          "Senior executives, team directors, or business owners looking to steer their enterprise through complex market competition.",
        syllabus:
          "SWOT analysis, corporate vision planning, competitive strategy, change management frameworks, and leadership psychology.",
        use: "Prepares individuals for C-suite roles (CEO, COO) by training them to formulate long-term sustainable growth models.",
      },
      {
        title: "Human Resources Management",
        audience:
          "HR professionals, office administrators, and managers looking to handle employee relationships and talent acquisition flawlessly.",
        syllabus:
          "Recruitment strategies, compensation and benefits, performance appraisal systems, conflict resolution, and employee development frameworks.",
        use: "Critical for building a high-performing corporate culture, reducing employee turnover, and managing corporate legal obligations effectively.",
      },
      {
        title: "Sale and Marketing",
        audience:
          "Marketing executives, sales agents, brand managers, and independent small business owners.",
        syllabus:
          "Market research, consumer psychology, branding, marketing mix (4Ps), digital marketing strategy, and modern sales conversion closing strategies.",
        use: "Directly impacts company revenue by training personnel to create high-converting promotional campaigns and loyal consumer bases.",
      },
    ],
  },
  {
    title: "Education & Pedagogy Programs",
    slug: "education",
    shortLabel: "Education",
    description:
      "Teaching methodology, child development, and classroom skills for educators shaping the next generation.",
    programs: [
      {
        title: "Early Childhood Care and Development (ECCD)",
        audience:
          "Preschool teachers, kindergarten staff, nursery administrators, and parents seeking scientific early development pathways.",
        syllabus:
          "Early milestones of children, designing play-based learning spaces, health and safety management, and emotional support foundations.",
        use: "Opens rich career avenues in premium nursery centers, kindergarten academies, and community development child welfare projects.",
      },
      {
        title: "Child Psychology",
        audience:
          "Educators, student counselors, social workers, and parents looking to understand behavioral patterns and cognitive processing in children.",
        syllabus:
          "Cognitive development theories (Piaget, Vygotsky), emotional regulation patterns, handling behavioral anomalies, and childhood trauma prevention.",
        use: "Equips professionals to resolve student behavior issues scientifically, offering specialized consultation paths in schools and clinical centers.",
      },
      {
        title: "Teaching English As A Second Language (TESL)",
        audience:
          "Aspiring or practicing English language teachers aiming to achieve professional global certification.",
        syllabus:
          "Language teaching methodologies (CLIL, Communicative Approach), lesson planning, language skill integration (4 macro skills), and modern assessment tools.",
        use: "Provides the ultimate credentials needed to teach English professionally across private international language institutes and schools nationwide or abroad.",
      },
      {
        title: "Teaching English to Young Learners (TEYL)",
        audience:
          "Primary school educators, language mentors, and home tutors targeting students aged 4 to 12.",
        syllabus:
          "Gamification of grammar, story-telling techniques, total physical response (TPR), phonics fun training models, and interactive language activities.",
        use: "Enables teachers to keep young language classrooms highly engaged, joyful, and effective, making them highly sought-after in standard private primary setups.",
      },
      {
        title: "Modern Teaching With AI",
        audience:
          "Tech-forward educators, curriculum designers, and institutional directors aiming to supercharge teaching efficiency.",
        syllabus:
          "AI tools for personalized lesson plan generation, automated quiz creation, designing visual assets using generative AI, and ethical boundaries of AI usage in schools.",
        use: "Reduces administrative workload by up to 50%, allowing teachers to focus deeply on student mentoring while executing state-of-the-art interactive teaching.",
      },
      {
        title: "Classroom Management",
        audience:
          "Teachers dealing with noisy classrooms, disruptive student behavior, or low engagement ratios.",
        syllabus:
          "Establishing classroom norms, student seating dynamic planning, positive behavioral enforcement structures, and time-management inside a lecture.",
        use: "Guarantees a safe, stress-free, and productive teaching environment where students successfully digest learning objectives every session.",
      },
    ],
  },
  {
    title: "Applied Sciences & Technical Workplace Skills",
    slug: "applied-sciences",
    shortLabel: "Applied Sciences",
    description:
      "Practical psychology, sustainability, and office software skills that translate directly into workplace value.",
    programs: [
      {
        title: "General Psychology",
        audience:
          "Anyone seeking to understand the inner workings of human behavior, perception, motivation, and personality development.",
        syllabus:
          "Neurological baselines of behavior, memory mechanics, emotional theories, personality profiling, and social interaction influences.",
        use: "Improves interpersonal intelligence, relationship building, leadership clarity, and provides critical entry insights across multiple professional fields like management or marketing.",
      },
      {
        title: "Foundation of Environmental Science and Sustainability",
        audience:
          "NGO workers, environmental enthusiasts, engineering students, and corporate social responsibility (CSR) committee members.",
        syllabus:
          "Ecosystem dynamics, climate metrics, waste handling structures, renewable energy baselines, and sustainable global practices.",
        use: "Prepares individuals for roles in green environmental agencies, sustainability project management, and drafting CSR programs for modern sustainable corporations.",
      },
      {
        title: "Advanced Excel For Workplace",
        audience:
          "Data analysts, accountants, sales managers, administrators, and anyone dealing heavily with business reporting or data organization.",
        syllabus:
          "Advanced logical and lookup formulas (VLOOKUP, XLOOKUP, INDEX/MATCH), Pivot Tables and Charts, data validation arrays, and automated macro workflows.",
        use: "Transforms raw complex data sets into valuable corporate insights, automating hours of manual spreadsheet data work into a single click.",
      },
      {
        title: "Advanced Word and Powerpoint For Career Advantage",
        audience:
          "Corporate workers, secretaries, researchers, and professional trainers wanting their paperwork and slides to stand out visually and structurally.",
        syllabus:
          "Mastering Microsoft Word formatting layout rules, handling large referencing files, building custom PowerPoint dynamic masters, templates, data charts, and seamless transition morphs.",
        use: "Ensures every internal or client-facing document and sales pitch presentation looks exceptionally elite, persuasive, and strictly executive.",
      },
    ],
  },
];

export const categories: Category[] = rawCategories.map((category) => ({
  ...category,
  programs: category.programs.map((program) => ({
    ...program,
    slug: slugify(program.title),
  })),
}));

export const allPrograms: (Program & { categoryTitle: string })[] =
  categories.flatMap((category) =>
    category.programs.map((program) => ({
      ...program,
      categoryTitle: category.title,
    })),
  );

export function getProgramBySlug(slug: string) {
  return allPrograms.find((program) => program.slug === slug);
}
