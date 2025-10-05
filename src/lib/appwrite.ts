import { Client, Account, Functions } from 'appwrite';

// Validate environment variables
function validateEnv() {
  const required = {
    NEXT_PUBLIC_APPWRITE_ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
    NEXT_PUBLIC_APPWRITE_PROJECT: process.env.NEXT_PUBLIC_APPWRITE_PROJECT,
  };

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0 && typeof window === 'undefined') {
    console.warn(`Missing Appwrite environment variables: ${missing.join(', ')}`);
  }
}

validateEnv();

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT || '');

export const account = new Account(client);
export const functions = new Functions(client);
export { client };
