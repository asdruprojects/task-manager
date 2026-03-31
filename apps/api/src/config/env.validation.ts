import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRATION: string;

  @IsNumber()
  PORT: number;

  @IsOptional()
  @IsString()
  CLIENT_URL?: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const formatted = errors
      .map((err) =>
        Object.values((err.constraints as Record<string, string>) ?? {}).join(
          ', ',
        ),
      )
      .join('\n');
    throw new Error(`\n❌ Environment validation failed:\n${formatted}\n`);
  }

  return validatedConfig;
}
