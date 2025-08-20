import "server-only";

const config = {
  clientUrl: process.env.CLIENT_URL,
  databaseUrl: process.env.DATABASE_URL,
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587", 10),
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || '"SkillSync" <noreply@skillsync.app>',
  },
};

if (!config.databaseUrl || !config.clientUrl) {
  throw new Error(
    "FATAL ERROR: A required environment variable (DATABASE_URL or CLIENT_URL) is missing."
  );
}

export default config;
