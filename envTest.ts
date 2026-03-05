import path from 'path';
import dotenv from 'dotenv';

// Resolve absolute path to the .env.QA file
const envFilePath = path.resolve(__dirname, '.env.QA');
console.log('Trying to load:', envFilePath);

const result = dotenv.config({ path: envFilePath });

if (result.error) {
  console.error('Error loading .env:', result.error);
} else {
  console.log('Loaded successfully');
}

console.log('USERNAME:', process.env.USERNAME);
console.log('PASSWORD:', process.env.PASSWORD);