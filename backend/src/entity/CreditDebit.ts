import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./User"

export enum TransactionType {
  CREDIT = "credit",
  DEBIT = "debit"
}

export enum PaymentMethod {
  CASH = "cash",
  BANK_TRANSFER = "bank_transfer",
  CHEQUE = "cheque",
  ONLINE = "online",
  OTHER = "other"
}

export enum EntityType {
  CUSTOMER = "customer",
  MANUAL = "manual"
}

@Entity("credit_debit_records")
export class CreditDebit {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({
    type: "enum",
    enum: EntityType,
    default: EntityType.CUSTOMER
  })
  entity_type: EntityType

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "customer_id" })
  customer: User

  @Column({ nullable: true })
  customer_id: string

  // Manual entry fields (when entity_type is MANUAL)
  @Column({ nullable: true })
  manual_name: string

  @Column({ nullable: true })
  manual_phone: string

  @Column({ nullable: true })
  manual_email: string

  @Column({
    type: "enum",
    enum: TransactionType
  })
  type: TransactionType

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number

  @Column({ type: "text", nullable: true })
  description: string

  @Column({
    type: "enum",
    enum: PaymentMethod,
    nullable: true
  })
  payment_method: PaymentMethod

  @Column({ nullable: true })
  reference_number: string

  @Column({ type: "date" })
  transaction_date: string

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  balance: number

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "recorded_by" })
  recordedBy: User

  @Column({ nullable: true })
  recorded_by: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
