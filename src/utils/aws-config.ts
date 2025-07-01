import { fromIni } from '@aws-sdk/credential-providers';
import { join } from 'path';
import { readFileSync } from 'fs';

export function configureAws(environment: 'development' | 'production' = 'development'): void {
  try {
    // Load configuration from file
    const configFile = JSON.parse(
      readFileSync(join(__dirname, '../../aws-config.json'), 'utf8')
    ) as {
      development: { profile: string; region: string };
      production: { profile: string; region: string };
    };
    
    const config = configFile[environment];
    
    if (!config) {
      throw new Error(`No configuration found for environment: ${environment}`);
    }

    // Configure AWS SDK v3
    const credentials = fromIni({
      profile: config.profile
    });

    // Set environment variables for other services
    process.env.AWS_REGION = config.region;
    process.env.AWS_PROFILE = config.profile;

    console.log(`AWS configured for ${environment} environment with profile: ${config.profile}`);
  } catch (error) {
    console.error('Error configuring AWS:', error);
    throw error;
  }
}
