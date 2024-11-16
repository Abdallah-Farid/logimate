import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users') // Maps to the 'users' table in the database
export class User {
  @PrimaryGeneratedColumn('uuid') // Automatically generates a unique ID
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'worker' }) // Default role is 'user'
  role: string;

  @CreateDateColumn()
  created_at: Date;
}
