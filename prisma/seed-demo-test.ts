import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { STANDARD_CEFR_BANDS } from "../app/lib/grading";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type QuestionSeed = {
  text: string;
  options: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
};

// Full 60-item bank from "CEFR-Aligned Level Test Database & Grading System".
// Q1-10 -> A1, 11-20 -> A2, 21-32 -> B1, 33-44 -> B2, 45-54 -> C1, 55-60 -> C2
// (matches STANDARD_CEFR_BANDS score cut points 1:1).
const QUESTIONS: QuestionSeed[] = [
  { text: "Choose the correct sentence:", options: ["She don't like apples.", "She doesn't likes apples.", "She doesn't like apples.", "She not like apples."], correct: 2 },
  { text: "Yesterday, we ________ to the cinema to watch a movie.", options: ["go", "went", "gone", "going"], correct: 1 },
  { text: "Which of the following words is a noun?", options: ["Beautiful", "Run", "Happiness", "Quickly"], correct: 2 },
  { text: "My brother is ________ than me.", options: ["tall", "taller", "tallest", "more tall"], correct: 1 },
  { text: "Look at ________ clouds in the sky over there.", options: ["this", "that", "these", "those"], correct: 3 },
  { text: "They ________ soccer every Sunday morning.", options: ["plays", "play", "playing", "are play"], correct: 1 },
  { text: "Where ________ you live?", options: ["do", "does", "are", "is"], correct: 0 },
  { text: "He is interested ________ learning photography.", options: ["on", "at", "in", "for"], correct: 2 },
  { text: "There isn't ________ milk left in the fridge.", options: ["some", "many", "any", "a"], correct: 2 },
  { text: "What time ________ the train arrive?", options: ["do", "is", "does", "are"], correct: 2 },
  { text: "This is ________ most exciting book I have ever read.", options: ["a", "an", "the", "more"], correct: 2 },
  { text: "I have two ________.", options: ["childs", "children", "childrens", "childes"], correct: 1 },
  { text: "Listen! Somebody ________ the piano upstairs.", options: ["plays", "playing", "is playing", "play"], correct: 2 },
  { text: "We didn't enjoy the trip because the weather was ________.", options: ["great", "terrible", "wonderful", "nice"], correct: 1 },
  { text: "Is this phone ________?", options: ["you", "your", "yours", "you's"], correct: 2 },
  { text: "She got up late, ________ she missed the first bus.", options: ["but", "because", "so", "although"], correct: 2 },
  { text: "Our annual English examination will take place ________ June.", options: ["on", "in", "at", "for"], correct: 1 },
  { text: "How ________ sugar do you want in your coffee?", options: ["many", "much", "few", "long"], correct: 1 },
  { text: "I can't find my keys ________.", options: ["anywhere", "somewhere", "nowhere", "everywhere"], correct: 0 },
  { text: "She ________ speaks French very well.", options: ["slow", "slowly", "slower", "slowest"], correct: 1 },

  { text: "If it rains tomorrow, we ________ the match.", options: ["cancel", "would cancel", "will cancel", "would have canceled"], correct: 2 },
  { text: "I ________ in Yangon since 2018.", options: ["am living", "lived", "have been living", "was living"], correct: 2 },
  { text: "The book was written ________ a famous author.", options: ["by", "with", "from", "through"], correct: 0 },
  { text: "Choose the word that means 'to delay until a later time':", options: ["Cancel", "Postpone", "Prevent", "Suspend"], correct: 1 },
  { text: "By the time the police arrived, the thief ________.", options: ["escaped", "has escaped", "had escaped", "was escaping"], correct: 2 },
  { text: "He suggested ________ to the museum this weekend.", options: ["to go", "going", "we to go", "should go"], correct: 1 },
  { text: "I don't mind ________ late if there is urgent work.", options: ["work", "to work", "working", "to working"], correct: 2 },
  { text: "This is the town ________ I grew up as a child.", options: ["which", "where", "that", "who"], correct: 1 },
  { text: "You ________ touch that hot stove; it is very dangerous.", options: ["don't have to", "shouldn't to", "mustn't", "needn't"], correct: 2 },
  { text: "I ________ to play the violin, but I gave it up years ago.", options: ["use", "used", "got used", "was used"], correct: 1 },
  { text: "She asked me where ________ the night before.", options: ["I had gone", "did I go", "had I gone", "I went"], correct: 0 },
  { text: "If I ________ rich, I would travel around the world.", options: ["am", "was", "were", "would be"], correct: 2 },
  { text: "The meeting has been put ________ until next Friday.", options: ["off", "out", "away", "down"], correct: 0 },
  { text: "She's very good at painting, ________?", options: ["is she", "isn't she", "does she", "doesn't she"], correct: 1 },
  { text: "Although the test was difficult, ________ she managed to pass.", options: ["but", "and", "(no word needed)", "however"], correct: 2 },
  { text: "I am looking forward ________ you at the conference.", options: ["to see", "seeing", "to seeing", "of seeing"], correct: 2 },
  { text: "They were too tired ________ studying any longer.", options: ["for continuing", "to continue", "for to continue", "continue"], correct: 1 },
  { text: "The new manager is much more active ________ the previous one.", options: ["as", "than", "from", "that"], correct: 1 },
  { text: "You ________ bring your umbrella. It is not going to rain.", options: ["don't need", "needn't to", "don't have to", "mustn't"], correct: 2 },
  { text: "By next year, they ________ building the new highway.", options: ["will finish", "will be finishing", "will have finished", "are going to finish"], correct: 2 },

  { text: "I would rather you ________ tell anyone what I just said.", options: ["don't", "didn't", "won't", "not to"], correct: 1 },
  { text: "Seldom ________ such a beautiful performance.", options: ["I have seen", "have I seen", "I saw", "did I saw"], correct: 1 },
  { text: "Despite ________ hard, he did not pass the exam.", options: ["he studied", "of studying", "studying", "his study"], correct: 2 },
  { text: "Which of the following is a synonym for 'ephemeral'?", options: ["Permanent", "Short-lived", "Beautiful", "Weak"], correct: 1 },
  { text: "If he had accepted the job, he ________ in London now.", options: ["would have lived", "would live", "will live", "lived"], correct: 1 },
  { text: "No sooner ________ reached the station than the train pulled out.", options: ["we had", "had we", "did we", "were we"], correct: 1 },
  { text: "He is rumored ________ a fortune on the stock market last year.", options: ["to lose", "to have lost", "that he lost", "losing"], correct: 1 },
  { text: "It is essential that she ________ present at the board meeting.", options: ["is", "be", "was", "will be"], correct: 1 },
  { text: "The committee ________ of seven independent experts.", options: ["comprises", "consists", "composes", "includes"], correct: 1 },
  { text: "Should you require further assistance, please do not ________ to contact us.", options: ["delay", "pause", "hesitate", "stop"], correct: 2 },

  { text: "The suspect denied ________ the secure database without authorization.", options: ["to access", "having accessed", "to have accessed", "access"], correct: 1 },
  { text: "She got the job ________ her total lack of experience.", options: ["despite of", "in spite", "notwithstanding", "although"], correct: 2 },
  { text: "The negotiations fell ________ because they couldn't agree on a price.", options: ["off", "down", "through", "out"], correct: 2 },
  { text: "He spoke with a ________ of authority that commanded respect.", options: ["measure", "level", "touch", "degree"], correct: 0 },
  { text: "The more you practice, ________ confident you will become.", options: ["the more", "the most", "more", "highly"], correct: 0 },
  { text: "He was accused of ________ classified documents to a competitor.", options: ["leaking", "spilling", "releasing", "exposing"], correct: 0 },
  { text: "Hardly ________ started his presentation when the power went out.", options: ["he had", "had he", "did he", "was he"], correct: 1 },
  { text: "Such was the ________ of the storm that trees were uprooted.", options: ["intensity", "tension", "load", "weight"], correct: 0 },
  { text: "The government is seeking to ________ the rising inflation rate.", options: ["curb", "crop", "bend", "break"], correct: 0 },
  { text: "Had we known about the delay, we ________ our itinerary accordingly.", options: ["adjusted", "would adjust", "would have adjusted", "had adjusted"], correct: 2 },
];

const OPTION_LABELS = ["A", "B", "C", "D"] as const;

async function main() {
  const slug = "general-english-cefr-placement-test";

  await prisma.test.deleteMany({ where: { slug } });

  const test = await prisma.test.create({
    data: {
      name: "General English CEFR Placement Test",
      slug,
      description:
        "60-question multiple-choice placement test aligned to the CEFR framework (A1-C2).",
      isActive: true,
      levels: {
        create: STANDARD_CEFR_BANDS.map((band, index) => ({
          code: band.code,
          name: band.name,
          description: band.description,
          minScore: band.minScore,
          maxScore: band.maxScore,
          order: index,
        })),
      },
    },
    include: { levels: true },
  });

  const levelIdByCode = new Map(test.levels.map((l) => [l.code, l.id]));
  const cutoffs = STANDARD_CEFR_BANDS.map((b) => b.maxScore);

  function levelCodeForQuestionIndex(index: number) {
    const questionNumber = index + 1;
    const band = STANDARD_CEFR_BANDS.find((b, i) => {
      const start = i === 0 ? 1 : cutoffs[i - 1] + 1;
      return questionNumber >= start && questionNumber <= b.maxScore;
    });
    return band?.code ?? STANDARD_CEFR_BANDS[STANDARD_CEFR_BANDS.length - 1].code;
  }

  // Sequential, outside a transaction: 60 nested creates over a pooled
  // connection can exceed Prisma's interactive-transaction deadline.
  for (const [index, q] of QUESTIONS.entries()) {
    const levelCode = levelCodeForQuestionIndex(index);
    await prisma.question.create({
      data: {
        testId: test.id,
        levelId: levelIdByCode.get(levelCode) ?? null,
        text: q.text,
        order: index,
        options: {
          create: q.options.map((text, i) => ({
            label: OPTION_LABELS[i],
            text,
            isCorrect: i === q.correct,
          })),
        },
      },
    });
  }

  console.log(`Demo test created: ${test.id} (${QUESTIONS.length} questions)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
