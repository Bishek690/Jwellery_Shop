import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity("contacts")
export class Contact {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  email: string

  @Column({ nullable: true })
  phone: string

  @Column({ nullable: true })
  subject: string

  @Column("text")
  message: string

  @Column({ default: "pending" })
  status: string // pending, responded, archived

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
