import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum ProductCategory {
  RINGS = "rings",
  NECKLACES = "necklaces",
  EARRINGS = "earrings",
  BRACELETS = "bracelets",
  BANGLES = "bangles",
  PENDANTS = "pendants",
  CHAINS = "chains",
  SETS = "sets",
  OTHER = "other"
}

export enum ProductStatus {
  IN_STOCK = "in-stock",
  LOW_STOCK = "low-stock",
  OUT_OF_STOCK = "out-of-stock",
  DISCONTINUED = "discontinued"
}

export enum MetalType {
  GOLD = "gold",
  SILVER = "silver",
  PLATINUM = "platinum",
  ROSE_GOLD = "rose-gold",
  WHITE_GOLD = "white-gold",
  DIAMOND = "diamond"
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  sku!: string;

  @Column("text")
  description!: string;

  @Column({ type: "enum", enum: ProductCategory })
  category!: ProductCategory;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  discountPrice?: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  cost!: number;

  @Column({ type: "decimal", precision: 8, scale: 3 })
  weight!: number; // in grams

  @Column({ type: "enum", enum: MetalType })
  metalType!: MetalType;

  @Column()
  purity!: string; // e.g., "22K", "18K", "925"

  @Column({ type: "int", default: 0 })
  stock!: number;

  @Column({ type: "int", default: 5 })
  minStock!: number;

  @Column({ type: "enum", enum: ProductStatus, default: ProductStatus.IN_STOCK })
  status!: ProductStatus;

  @Column({ default: false })
  featured!: boolean;

  @Column({ nullable: true })
  image?: string;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
