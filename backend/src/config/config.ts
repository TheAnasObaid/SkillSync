import { config } from "dotenv";
config();

const appConfig = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  clientUrl: process.env.CLIENT_URL,

  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "2525", 10),
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM,
  },
};

// A check to ensure all essential variables are loaded
if (!appConfig.mongoUri || !appConfig.jwtSecret || !appConfig.clientUrl) {
  throw new Error("FATAL ERROR: Missing required environment variables.");
}

export default appConfig;
