import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error(
    "❌ FATAL ERROR: MONGO_URI is not defined in your .env.local file."
  );
  process.exit(1);
}

const PLAIN_TEXT_PASSWORD = "123456";

const adminId = new ObjectId("65a1a1a1a1a1a1a1a1a1a1a1");
const clientIdAcme = new ObjectId("65b2b2b2b2b2b2b2b2b2b2b2");
const clientIdInnovate = new ObjectId("65c3c3c3c3c3c3c3c3c3c3c3");
const devIdAlice = new ObjectId("65d4d4d4d4d4d4d4d4d4d4d4");
const devIdBob = new ObjectId("65e5e5e5e5e5e5e5e5e5e5e5");
const devIdCarol = new ObjectId("65f6f6f6f6f6f6f6f6f6f6f6");

const chatChallengeId = new ObjectId("75a1a1a1a1a1a1a1a1a1a1a1");
const dashboardChallengeId = new ObjectId("75b2b2b2b2b2b2b2b2b2b2b2");
const landingPageChallengeId = new ObjectId("75c3c3c3c3c3c3c3c3c3c3c3");
const apiChallengeId = new ObjectId("75d4d4d4d4d4d4d4d4d4d4d4");
const mobileUiChallengeId = new ObjectId("75e5e5e5e5e5e5e5e5e5e5e5");
const dockerChallengeId = new ObjectId("75f6f6f6f6f6f6f6f6f6f6f6");
const cmsChallengeId = new ObjectId("76a1a1a1a1a1a1a1a1a1a1a1");

const submissionAliceToChat = new ObjectId("85a1a1a1a1a1a1a1a1a1a1a1");
const submissionAliceToDashboard = new ObjectId("85b2b2b2b2b2b2b2b2b2b2b2");
const submissionBobToDashboard = new ObjectId("85c3c3c3c3c3c3c3c3c3c3c3");
const submissionBobToApi = new ObjectId("85d4d4d4d4d4d4d4d4d4d4d4");
const submissionCarolToApi = new ObjectId("85e5e5e5e5e5e5e5e5e5e5e5");
const submissionAliceToMobile = new ObjectId("85f6f6f6f6f6f6f6f6f6f6f6");
const submissionBobToMobile = new ObjectId("86a1a1a1a1a1a1a1a1a1a1a1");
const submissionAliceToDocker = new ObjectId("86b2b2b2b2b2b2b2b2b2b2b2");
const submissionBobToDocker = new ObjectId("86c3c3c3c3c3c3c3c3c3c3c3");

async function getHashedPassword() {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(PLAIN_TEXT_PASSWORD, salt);
}

async function getUsers(hashedPassword: string) {
  return [
    {
      _id: adminId,
      email: "admin@skillsync.app",
      password: hashedPassword,
      role: "admin",
      accountStatus: "active",
      profile: {
        firstName: "Admin",
        lastName: "User",
        skills: [],
        portfolio: [],
      },
      reputation: { rating: 0, totalRatings: 0, completedChallenges: 0 },
      earnings: 0,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    {
      _id: clientIdAcme,
      email: "contact@acme.inc",
      password: hashedPassword,
      role: "client",
      accountStatus: "active",
      profile: {
        firstName: "John",
        lastName: "Smith",
        companyName: "Acme Inc.",
        bio: "Acme Inc. is a leading provider of innovative solutions for the modern web.",
        skills: [],
        portfolio: [],
      },
      reputation: { rating: 0, totalRatings: 0, completedChallenges: 0 },
      earnings: 0,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: clientIdInnovate,
      email: "manager@innovate.llc",
      password: hashedPassword,
      role: "client",
      accountStatus: "active",
      profile: {
        firstName: "Maria",
        lastName: "Garcia",
        companyName: "Innovate LLC",
        bio: "We build the future of enterprise software.",
        skills: [],
        portfolio: [],
      },
      reputation: { rating: 0, totalRatings: 0, completedChallenges: 0 },
      earnings: 0,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    {
      _id: devIdAlice,
      email: "alice.dev@example.com",
      password: hashedPassword,
      role: "developer",
      accountStatus: "active",
      profile: {
        firstName: "Alice",
        lastName: "Dev",
        bio: "Full-stack developer with a passion for creating beautiful and functional user interfaces.",
        skills: ["React", "TypeScript", "Node.js", "GraphQL"],
        experience: "Advanced",
        portfolio: [
          {
            _id: new ObjectId(),
            title: "E-commerce Storefront",
            description:
              "A fully responsive e-commerce site built with Next.js and Stripe.",
            imageUrl: "uploads/portfolio/placeholder1.jpg",
            liveUrl: "#",
            githubUrl: "#",
          },
        ],
      },
      reputation: { rating: 4.0, totalRatings: 2, completedChallenges: 1 },
      earnings: 1000,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: devIdBob,
      email: "bob.coder@example.com",
      password: hashedPassword,
      role: "developer",
      accountStatus: "active",
      profile: {
        firstName: "Bob",
        lastName: "Coder",
        bio: "Backend specialist focused on Python, Django, and PostgreSQL.",
        skills: ["Python", "Django", "PostgreSQL", "Docker"],
        experience: "Intermediate",
        portfolio: [],
      },
      reputation: { rating: 4.5, totalRatings: 2, completedChallenges: 1 },
      earnings: 1500,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: devIdCarol,
      email: "carol.eng@example.com",
      password: hashedPassword,
      role: "developer",
      accountStatus: "active",
      profile: {
        firstName: "Carol",
        lastName: "Engineer",
        bio: "DevOps and Cloud infrastructure expert. I automate everything.",
        skills: ["Kubernetes", "Terraform", "CI/CD", "Go"],
        experience: "Expert",
        portfolio: [],
      },
      reputation: { rating: 0, totalRatings: 0, completedChallenges: 0 },
      earnings: 0,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}

const challenges = [
  {
    _id: chatChallengeId,
    title: "Real-Time Chat Application",
    description: "Build a responsive, multi-room chat application.",
    requirements: "...",
    prize: 2000,
    category: "Web Application",
    difficulty: "intermediate",
    status: "published",
    tags: ["React", "Next.js", "Real-time"],
    isFunded: true,
    createdBy: clientIdAcme,
    submissions: [submissionAliceToChat],
    deadline: new Date(new Date().setDate(new Date().getDate() + 30)),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: dashboardChallengeId,
    title: "Data Analytics Dashboard",
    description: "Develop a dashboard to visualize sales data.",
    requirements: "...",
    prize: 1500,
    category: "Data Visualization",
    difficulty: "advanced",
    status: "completed",
    tags: ["Data Viz", "Python", "Dashboard"],
    isFunded: true,
    createdBy: clientIdAcme,
    submissions: [submissionBobToDashboard, submissionAliceToDashboard],
    deadline: new Date(new Date().setDate(new Date().getDate() - 15)),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: landingPageChallengeId,
    title: "SaaS Landing Page Redesign",
    description: "Redesign our main landing page for better conversion.",
    requirements: "...",
    prize: 750,
    category: "UI/UX",
    difficulty: "beginner",
    status: "published",
    tags: ["UI", "CSS", "Design"],
    isFunded: false,
    createdBy: clientIdAcme,
    submissions: [],
    deadline: new Date(new Date().setDate(new Date().getDate() + 20)),
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    _id: apiChallengeId,
    title: "REST API for a Blog Platform",
    description:
      "Design and build a complete RESTful API for a blogging application.",
    requirements: "...",
    prize: 1200,
    category: "Backend",
    difficulty: "intermediate",
    status: "judging",
    tags: ["API", "Node.js", "Express"],
    isFunded: true,
    createdBy: clientIdInnovate,
    submissions: [submissionBobToApi, submissionCarolToApi],
    deadline: new Date(new Date().setDate(new Date().getDate() - 2)),
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    _id: mobileUiChallengeId,
    title: "Mobile UI Kit in Figma",
    description:
      "Create a reusable, modern UI kit for a social media mobile app.",
    requirements: "...",
    prize: 1000,
    category: "Design",
    difficulty: "beginner",
    status: "completed",
    tags: ["Figma", "UI/UX", "Mobile"],
    isFunded: true,
    createdBy: clientIdInnovate,
    submissions: [submissionAliceToMobile, submissionBobToMobile],
    deadline: new Date(new Date().setDate(new Date().getDate() - 40)),
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    _id: dockerChallengeId,
    title: "Dockerize a Legacy Application",
    description:
      "Containerize a monolithic legacy PHP application for modern deployment.",
    requirements: "...",
    prize: 3000,
    category: "DevOps",
    difficulty: "advanced",
    status: "judging",
    tags: ["Docker", "CI/CD", "PHP"],
    isFunded: true,
    createdBy: clientIdAcme,
    submissions: [submissionAliceToDocker, submissionBobToDocker],
    deadline: new Date(new Date().setDate(new Date().getDate() - 5)),
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    _id: cmsChallengeId,
    title: "Static Site with a Headless CMS",
    description:
      "Build a fast, static blog using Next.js and a headless CMS like Sanity or Strapi.",
    requirements: "...",
    prize: 900,
    category: "Web Development",
    difficulty: "intermediate",
    status: "published",
    tags: ["Jamstack", "Next.js", "CMS"],
    isFunded: true,
    createdBy: clientIdInnovate,
    submissions: [],
    deadline: new Date(new Date().setDate(new Date().getDate() + 50)),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const submissions = [
  {
    _id: submissionAliceToChat,
    githubRepo: "https://github.com/alice-dev/chat-app-submission",
    description: "My submission for the real-time chat application.",
    liveDemo: "https://alice-chat-app.vercel.app",
    status: "pending",
    challengeId: chatChallengeId,
    developerId: devIdAlice,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: submissionBobToDashboard,
    githubRepo: "https://github.com/bob-coder/analytics-dashboard",
    description:
      "Completed the data analytics dashboard using Django and Chart.js.",
    liveDemo: "https://bob-dashboard.heroku.app",
    status: "winner",
    challengeId: dashboardChallengeId,
    developerId: devIdBob,
    ratings: { overall: 5 },
    feedback: "Excellent work, Bob! Hired!",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: submissionAliceToDashboard,
    githubRepo: "https://github.com/alice-dev/dashboard-attempt",
    description: "My attempt at the dashboard.",
    liveDemo: "https://alice-dashboard.vercel.app",
    status: "rejected",
    challengeId: dashboardChallengeId,
    developerId: devIdAlice,
    ratings: { overall: 3 },
    feedback: "Good effort, but we required backend processing.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    _id: submissionBobToApi,
    githubRepo: "https://github.com/bob-coder/blog-api",
    description:
      "A robust blog API with full CRUD functionality and JWT authentication.",
    liveDemo: "https://bob-api.heroku.app/docs",
    status: "pending",
    challengeId: apiChallengeId,
    developerId: devIdBob,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: submissionCarolToApi,
    githubRepo: "https://github.com/carol-eng/fastapi-blog",
    description:
      "Used FastAPI for a high-performance solution. Includes full test coverage.",
    liveDemo: "https://carol-blog.fly.dev/docs",
    status: "pending",
    challengeId: apiChallengeId,
    developerId: devIdCarol,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    _id: submissionAliceToMobile,
    githubRepo: "https://figma.com/alice/mobile-ui-kit",
    description:
      "A clean and modern UI kit with components for all major social media features.",
    liveDemo: "https://figma.com/proto/alice",
    status: "winner",
    challengeId: mobileUiChallengeId,
    developerId: devIdAlice,
    ratings: { overall: 5 },
    feedback:
      "Beautiful design system, Alice. Exactly what we were looking for.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: submissionBobToMobile,
    githubRepo: "https://figma.com/bob/mobile-ui",
    description: "A functional but simple UI kit.",
    liveDemo: "https://figma.com/proto/bob",
    status: "rejected",
    challengeId: mobileUiChallengeId,
    developerId: devIdBob,
    ratings: { overall: 4 },
    feedback: "Solid work, but Alice's design was more aligned with our brand.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    _id: submissionAliceToDocker,
    githubRepo: "https://github.com/alice-dev/docker-legacy-php",
    description:
      "Multi-stage Dockerfile to create a slim, secure production image.",
    liveDemo: "",
    status: "reviewed",
    challengeId: dockerChallengeId,
    developerId: devIdAlice,
    ratings: { overall: 5 },
    feedback: "Very impressive Dockerfile optimization.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: submissionBobToDocker,
    githubRepo: "https://github.com/bob-coder/dockerize-php",
    description:
      "Used Docker Compose to orchestrate the PHP app with a database container.",
    liveDemo: "",
    status: "reviewed",
    challengeId: dockerChallengeId,
    developerId: devIdBob,
    ratings: { overall: 4 },
    feedback: "Great use of Compose, but the final image is a bit large.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function main() {
  const client = new MongoClient(MONGO_URI!);
  try {
    console.log("Connecting to the database...");
    await client.connect();
    console.log("✅ Database connection successful.");
    const db = client.db();

    console.log("\nClearing existing data...");
    await db.collection("users").deleteMany({});
    await db.collection("challenges").deleteMany({});
    await db.collection("submissions").deleteMany({});
    console.log("✅ Collections cleared.");

    console.log("\nHashing passwords...");
    const hashedPassword = await getHashedPassword();
    const usersToInsert = await getUsers(hashedPassword);
    console.log("✅ Passwords hashed.");

    console.log("\nInserting data...");
    await db.collection("users").insertMany(usersToInsert);
    await db.collection("challenges").insertMany(challenges);
    await db.collection("submissions").insertMany(submissions);
    console.log("✅ All data inserted successfully.");
  } catch (error) {
    console.error("❌ An error occurred during the seeding process:", error);
  } finally {
    await client.close();
    console.log("\nDatabase connection closed.");
    console.log("🚀 Seeding complete!");
  }
}

main();
