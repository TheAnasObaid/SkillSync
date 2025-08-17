import "server-only";

const config = {
  clientUrl: process.env.CLIENT_URL,

  databaseUrl: process.env.DATABASE_URL,

  jwtSecret: process.env.JWT_SECRET,

  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587", 10),
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || '"SkillSync" <noreply@skillsync.app>',
  },
};

if (!config.databaseUrl || !config.jwtSecret || !config.clientUrl) {
  throw new Error(
    "FATAL ERROR: A required environment variable (DATABASE_URL, JWT_SECRET, or CLIENT_URL) is missing."
  );
}

export default config;
