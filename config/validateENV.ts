export function validateEnv(requiredVars: string[], envName: string) {
  const missingVars = requiredVars.filter(
    (key) => !process.env[key] || process.env[key]?.trim() === ''
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables in .env.${envName}: ${missingVars.join(', ')}`
    );
  }
}