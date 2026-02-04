import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./User"

@Entity()
export class SalesRecord {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  billNumber: string

  @Column()
  customerName: string

  @Column({ nullable: true })
  customerPhone: string

  @Column({ nullable: true })
  customerEmail: string

  @Column({ nullable: true })
  customerAddress: string

  @Column()
  saleType: string // 'product' or 'raw-metal'

  @Column({ type: "text" })
  itemsData: string // JSON string of items sold

  @Column("decimal", { precision: 10, scale: 2 })
  subtotal: number

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  discount: number

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  tax: number

  @Column("decimal", { precision: 10, scale: 2 })
  totalAmount: number

  @Column()
  paymentMethod: string // 'cash', 'card', 'wallet', 'bank-transfer'

  @Column({ default: 'completed' })
  status: string // 'completed', 'pending', 'cancelled'

  @Column({ nullable: true })
  billImage: string

  @Column({ type: "text", nullable: true })
  notes: string

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "createdById" })
  createdBy: User

  @Column()
  createdById: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
