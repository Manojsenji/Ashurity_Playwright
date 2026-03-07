import { logger } from "./logger";

export async function retry(
  action: () => Promise<void>,
  retries = 3,
  delay = 2000,
) {
  let lastError;

  for (let i = 0; i < retries; i++) {
    try {
      logger.info(`Retry attempt ${i + 1}`);
      await action();
      return;
    } catch (error) {
      lastError = error;
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw lastError;
}
