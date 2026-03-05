import dotenv from 'dotenv';
import { validateEnv } from './config/validateENV';

export default async () => {
  const env = process.env.ENV || 'DEV';

  dotenv.config({
    path: `.env.${env}`,
    override: true,
  });

  validateEnv(['BASE_URL', 'USERNAME', 'PASSWORD'], env);

  console.log(`Environment Loaded: ${env}`);
};