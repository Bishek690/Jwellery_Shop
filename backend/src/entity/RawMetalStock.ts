import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class RawMetalStock {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  metalType: string // gold, silver, platinum, etc.

  @Column()
  purity: string // 24K, 22K, 18K, 925 Silver, etc.

  @Column("decimal", { precision: 10, scale: 3 })
  quantity: number // in grams

  @Column("decimal", { precision: 10, scale: 2 })
  costPerGram: number

  @Column("decimal", { precision: 10, scale: 3 })
  minQuantity: number // minimum stock alert

  @Column({ nullable: true })
  supplier: string

  @Column({ nullable: true })
  location: string // storage location

  @Column({ type: "text", nullable: true })
  notes: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
