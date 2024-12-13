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

  @Column({ default: 'user' }) // Default role is 'user'
  role: string;

  @CreateDateColumn()
  created_at: Date;

  // Method to return user data without sensitive fields
  toJSON() {
    const { password, ...rest } = this;
    return rest;
  }
}
