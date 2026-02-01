import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class MetalPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  goldPricePerTola: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  silverPricePerTola: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  platinumPricePerTola: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  roseGoldPricePerTola: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  whiteGoldPricePerTola: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  diamondPricePerCarat: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
