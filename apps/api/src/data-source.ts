import 'reflect-metadata';
import { config } from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { User } from './modules/users/entities/user.entity';
import { Task } from './modules/tasks/entities/task.entity';

config({ path: join(__dirname, '..', '.env') });

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Task],
  migrations: [join(__dirname, 'migrations', '*.ts')],
});
