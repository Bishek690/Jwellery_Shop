import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm"
import { User } from "./User"

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum PaymentMethod {
  COD = "cod",
  ONLINE = "online",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  orderNumber: string

  @ManyToOne(() => User)
  @JoinColumn()
  customer: User

  @Column()
  customerId: number

  @Column("decimal", { precision: 10, scale: 2 })
  subtotal: number

  @Column("decimal", { precision: 10, scale: 2 })
  shippingCost: number

  @Column("decimal", { precision: 10, scale: 2 })
  totalAmount: number

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus

  @Column({
    type: "enum",
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod

  @Column({
    type: "enum",
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus

  // Shipping Information
  @Column()
  shippingName: string

  @Column()
  shippingPhone: string

  @Column({ nullable: true })
  shippingEmail: string

  @Column()
  shippingAddress: string

  @Column()
  shippingCity: string

  @Column({ nullable: true })
  shippingState: string

  @Column({ nullable: true })
  shippingZipCode: string

  @Column("text", { nullable: true })
  notes: string

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[]

  @OneToMany(() => OrderTracking, (tracking) => tracking.order, { cascade: true })
  tracking: OrderTracking[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Order, (order) => order.items, { onDelete: "CASCADE" })
  order: Order

  @Column()
  orderId: number

  @Column()
  productId: number

  @Column()
  productName: string

  @Column()
  productSku: string

  @Column({ nullable: true })
  productImage: string

  @Column()
  metalType: string

  @Column()
  purity: string

  @Column("decimal", { precision: 10, scale: 3 })
  weight: number

  @Column("decimal", { precision: 10, scale: 2 })
  price: number

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  discountPrice: number

  @Column()
  quantity: number

  @Column("decimal", { precision: 10, scale: 2 })
  totalPrice: number

  @CreateDateColumn()
  createdAt: Date
}

@Entity()
export class OrderTracking {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Order, (order) => order.tracking, { onDelete: "CASCADE" })
  order: Order

  @Column()
  orderId: number

  @Column({
    type: "enum",
    enum: OrderStatus,
  })
  status: OrderStatus

  @Column("text", { nullable: true })
  notes: string

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "updatedById" })
  updatedBy: User

  @Column({ type: "int", nullable: true })
  updatedById: number

  @CreateDateColumn()
  createdAt: Date
}
