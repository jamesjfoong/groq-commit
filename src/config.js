import Conf from 'conf';
import dotenv from 'dotenv';

dotenv.config();

export const config = new Conf({
  projectName: 'groq-commit',
  defaults: {
    apiKey: process.env.GROQ_API_KEY || ''
  }
});