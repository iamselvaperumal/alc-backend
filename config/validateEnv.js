// Validate required environment variables at startup
// IMPORTANT: Throws an error instead of process.exit() for serverless compatibility
const validateEnv = () => {
  const required = ["MONGO_URI", "JWT_SECRET"];
  const missing = [];

  required.forEach((envVar) => {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  });

  if (missing.length > 0) {
    const errorMsg = ` FATAL: Missing required environment variables: ${missing.join(", ")}\n\nPlease set these in your Vercel project settings:\n${missing.map((v) => `  - ${v}`).join("\n")}\n\n👉 Go to: https://vercel.com/dashboard -> Your Project -> Settings -> Environment Variables`;

    console.error(errorMsg);
    throw new Error(errorMsg); // Throw instead of exit for serverless
  }

  // Validate MONGO_URI format
  if (process.env.MONGO_URI.includes("mongodb+srv://")) {
    // mongodb+srv URLs should NOT have port numbers
    if (process.env.MONGO_URI.match(/mongodb\+srv:\/\/.*:\d+/)) {
      const errorMsg = `❌ FATAL: MONGO_URI contains a port number (e.g., :27017)

📝 mongodb+srv:// URIs do NOT support port numbers!

❌ WRONG:  mongodb+srv://user:pass@cluster.mongodb.net:27017/dbname
✅ RIGHT:  mongodb+srv://user:pass@cluster.mongodb.net/dbname

🔧 SOLUTION:
1. Go to Vercel → Settings → Environment Variables
2. Find MONGO_URI
3. Remove the :PORT from the URL
4. Save and redeploy`;

      console.error(errorMsg);
      throw new Error(errorMsg); // Throw instead of exit for serverless
    }
  }

  console.log("✅ Environment variables validated");
};

module.exports = validateEnv;
