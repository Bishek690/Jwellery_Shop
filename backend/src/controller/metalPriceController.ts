import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { MetalPrice } from "../entity/MetalPrice";

// Get current metal prices
export const getCurrentPrices = async (req: Request, res: Response) => {
  try {
    const metalPriceRepository = AppDataSource.getRepository(MetalPrice);
    
    // Get the most recent active price
    const currentPrice = await metalPriceRepository.findOne({
      where: { isActive: true },
      order: { createdAt: "DESC" }
    });

    if (!currentPrice) {
      // Return default prices if none exist
      return res.json({
        goldPricePerTola: 0,
        silverPricePerTola: 0,
        platinumPricePerTola: 0,
        roseGoldPricePerTola: 0,
        whiteGoldPricePerTola: 0,
        diamondPricePerCarat: 0,
        createdAt: null,
        updatedAt: null,
        message: "No prices set yet"
      });
    }

    // Return with timestamps to show when prices were last updated
    res.json({
      goldPricePerTola: currentPrice.goldPricePerTola,
      silverPricePerTola: currentPrice.silverPricePerTola,
      platinumPricePerTola: currentPrice.platinumPricePerTola,
      roseGoldPricePerTola: currentPrice.roseGoldPricePerTola,
      whiteGoldPricePerTola: currentPrice.whiteGoldPricePerTola,
      diamondPricePerCarat: currentPrice.diamondPricePerCarat,
      createdAt: currentPrice.createdAt,
      updatedAt: currentPrice.updatedAt
    });
  } catch (error) {
    console.error("Error fetching metal prices:", error);
    res.status(500).json({ message: "Failed to fetch metal prices" });
  }
};

// Update metal prices (Admin/Staff only)
export const updatePrices = async (req: Request, res: Response) => {
  try {
    const { 
      goldPricePerTola, 
      silverPricePerTola, 
      platinumPricePerTola,
      roseGoldPricePerTola,
      whiteGoldPricePerTola,
      diamondPricePerCarat 
    } = req.body;

    // Validate input - at least one price must be provided
    if (!goldPricePerTola && !silverPricePerTola && !platinumPricePerTola && 
        !roseGoldPricePerTola && !whiteGoldPricePerTola && !diamondPricePerCarat) {
      return res.status(400).json({ message: "At least one price field is required" });
    }

    // Validate no negative prices
    const prices = { 
      goldPricePerTola, 
      silverPricePerTola, 
      platinumPricePerTola,
      roseGoldPricePerTola,
      whiteGoldPricePerTola,
      diamondPricePerCarat 
    };
    
    for (const [key, value] of Object.entries(prices)) {
      if (value !== undefined && value !== null && parseFloat(value) < 0) {
        return res.status(400).json({ message: `${key} cannot be negative` });
      }
    }

    const metalPriceRepository = AppDataSource.getRepository(MetalPrice);

    // Deactivate all previous prices
    await metalPriceRepository.update({ isActive: true }, { isActive: false });

    // Create new price entry
    const newPrice = metalPriceRepository.create({
      goldPricePerTola: parseFloat(goldPricePerTola) || 0,
      silverPricePerTola: parseFloat(silverPricePerTola) || 0,
      platinumPricePerTola: parseFloat(platinumPricePerTola) || 0,
      roseGoldPricePerTola: parseFloat(roseGoldPricePerTola) || 0,
      whiteGoldPricePerTola: parseFloat(whiteGoldPricePerTola) || 0,
      diamondPricePerCarat: parseFloat(diamondPricePerCarat) || 0,
      isActive: true
    });

    await metalPriceRepository.save(newPrice);

    res.json({
      message: "Metal prices updated successfully",
      data: newPrice
    });
  } catch (error) {
    console.error("Error updating metal prices:", error);
    res.status(500).json({ message: "Failed to update metal prices" });
  }
};

// Get price history
export const getPriceHistory = async (req: Request, res: Response) => {
  try {
    const metalPriceRepository = AppDataSource.getRepository(MetalPrice);
    
    const limit = parseInt(req.query.limit as string) || 10;
    
    const priceHistory = await metalPriceRepository.find({
      order: { createdAt: "DESC" },
      take: limit
    });

    res.json(priceHistory);
  } catch (error) {
    console.error("Error fetching price history:", error);
    res.status(500).json({ message: "Failed to fetch price history" });
  }
};
