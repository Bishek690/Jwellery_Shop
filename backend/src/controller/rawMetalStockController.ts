import { Request, Response } from "express"
import { AppDataSource } from "../config/data-source"
import { RawMetalStock } from "../entity/RawMetalStock"
import { Like } from "typeorm"

const rawMetalStockRepository = AppDataSource.getRepository(RawMetalStock)

// Get all raw metal stocks with filters
export const getRawMetalStocks = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = "", 
      metalType = "",
      lowStock = false
    } = req.query

    const skip = (Number(page) - 1) * Number(limit)
    
    let whereConditions: any = {}
    
    if (search) {
      whereConditions = [
        { metalType: Like(`%${search}%`) },
        { purity: Like(`%${search}%`) },
        { supplier: Like(`%${search}%`) }
      ]
    }
    
    if (metalType && metalType !== "all") {
      whereConditions = { ...whereConditions, metalType }
    }

    const [stocks, total] = await rawMetalStockRepository.findAndCount({
      where: whereConditions,
      skip,
      take: Number(limit),
      order: { createdAt: "DESC" }
    })

    // Filter for low stock if requested
    let filteredStocks = stocks
    if (lowStock === 'true') {
      filteredStocks = stocks.filter(stock => stock.quantity <= stock.minQuantity)
    }

    // Calculate status for each stock
    const stocksWithStatus = filteredStocks.map(stock => {
      let status = 'sufficient'
      if (stock.quantity <= 0) {
        status = 'out-of-stock'
      } else if (stock.quantity <= stock.minQuantity) {
        status = 'low-stock'
      }
      
      return {
        ...stock,
        status,
        totalValue: Number(stock.quantity) * Number(stock.costPerGram)
      }
    })

    res.json({
      stocks: stocksWithStatus,
      pagination: {
        total: lowStock === 'true' ? filteredStocks.length : total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil((lowStock === 'true' ? filteredStocks.length : total) / Number(limit))
      }
    })
  } catch (error) {
    console.error("Error fetching raw metal stocks:", error)
    res.status(500).json({ message: "Error fetching raw metal stocks" })
  }
}

// Get single raw metal stock
export const getRawMetalStock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const stock = await rawMetalStockRepository.findOne({ where: { id: Number(id) } })

    if (!stock) {
      return res.status(404).json({ message: "Raw metal stock not found" })
    }

    let status = 'sufficient'
    if (stock.quantity <= 0) {
      status = 'out-of-stock'
    } else if (stock.quantity <= stock.minQuantity) {
      status = 'low-stock'
    }

    res.json({
      ...stock,
      status,
      totalValue: Number(stock.quantity) * Number(stock.costPerGram)
    })
  } catch (error) {
    console.error("Error fetching raw metal stock:", error)
    res.status(500).json({ message: "Error fetching raw metal stock" })
  }
}

// Create new raw metal stock
export const createRawMetalStock = async (req: Request, res: Response) => {
  try {
    const { metalType, purity, quantity, costPerGram, minQuantity, supplier, location, notes } = req.body

    // Validate required fields
    if (!metalType || !purity || quantity === undefined || costPerGram === undefined) {
      return res.status(400).json({ message: "Please provide all required fields" })
    }

    const newStock = rawMetalStockRepository.create({
      metalType,
      purity,
      quantity: Number(quantity),
      costPerGram: Number(costPerGram),
      minQuantity: Number(minQuantity) || 0,
      supplier,
      location,
      notes
    })

    const savedStock = await rawMetalStockRepository.save(newStock)

    res.status(201).json(savedStock)
  } catch (error) {
    console.error("Error creating raw metal stock:", error)
    res.status(500).json({ message: "Error creating raw metal stock" })
  }
}

// Update raw metal stock
export const updateRawMetalStock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { metalType, purity, quantity, costPerGram, minQuantity, supplier, location, notes } = req.body

    const stock = await rawMetalStockRepository.findOne({ where: { id: Number(id) } })

    if (!stock) {
      return res.status(404).json({ message: "Raw metal stock not found" })
    }

    // Update fields
    if (metalType !== undefined) stock.metalType = metalType
    if (purity !== undefined) stock.purity = purity
    if (quantity !== undefined) stock.quantity = Number(quantity)
    if (costPerGram !== undefined) stock.costPerGram = Number(costPerGram)
    if (minQuantity !== undefined) stock.minQuantity = Number(minQuantity)
    if (supplier !== undefined) stock.supplier = supplier
    if (location !== undefined) stock.location = location
    if (notes !== undefined) stock.notes = notes

    const updatedStock = await rawMetalStockRepository.save(stock)

    res.json(updatedStock)
  } catch (error) {
    console.error("Error updating raw metal stock:", error)
    res.status(500).json({ message: "Error updating raw metal stock" })
  }
}

// Delete raw metal stock
export const deleteRawMetalStock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const stock = await rawMetalStockRepository.findOne({ where: { id: Number(id) } })

    if (!stock) {
      return res.status(404).json({ message: "Raw metal stock not found" })
    }

    await rawMetalStockRepository.remove(stock)

    res.json({ message: "Raw metal stock deleted successfully" })
  } catch (error) {
    console.error("Error deleting raw metal stock:", error)
    res.status(500).json({ message: "Error deleting raw metal stock" })
  }
}

// Adjust stock quantity (add or remove)
export const adjustStockQuantity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { adjustment, notes } = req.body // adjustment can be positive (add) or negative (remove)

    if (adjustment === undefined || adjustment === 0) {
      return res.status(400).json({ message: "Please provide a valid adjustment value" })
    }

    const stock = await rawMetalStockRepository.findOne({ where: { id: Number(id) } })

    if (!stock) {
      return res.status(404).json({ message: "Raw metal stock not found" })
    }

    const newQuantity = Number(stock.quantity) + Number(adjustment)

    if (newQuantity < 0) {
      return res.status(400).json({ message: "Insufficient stock. Cannot remove more than available." })
    }

    stock.quantity = newQuantity
    if (notes) {
      stock.notes = notes
    }

    const updatedStock = await rawMetalStockRepository.save(stock)

    res.json({
      ...updatedStock,
      adjustment: Number(adjustment),
      message: adjustment > 0 ? "Stock added successfully" : "Stock removed successfully"
    })
  } catch (error) {
    console.error("Error adjusting stock quantity:", error)
    res.status(500).json({ message: "Error adjusting stock quantity" })
  }
}

// Get stock statistics
export const getStockStatistics = async (req: Request, res: Response) => {
  try {
    const stocks = await rawMetalStockRepository.find()

    const totalValue = stocks.reduce((sum, stock) => {
      return sum + (Number(stock.quantity) * Number(stock.costPerGram))
    }, 0)

    const lowStockItems = stocks.filter(stock => stock.quantity <= stock.minQuantity).length
    const outOfStockItems = stocks.filter(stock => stock.quantity <= 0).length

    // Group by metal type
    const byMetalType = stocks.reduce((acc: any, stock) => {
      if (!acc[stock.metalType]) {
        acc[stock.metalType] = {
          totalQuantity: 0,
          totalValue: 0,
          items: 0
        }
      }
      acc[stock.metalType].totalQuantity += Number(stock.quantity)
      acc[stock.metalType].totalValue += Number(stock.quantity) * Number(stock.costPerGram)
      acc[stock.metalType].items += 1
      return acc
    }, {})

    res.json({
      totalItems: stocks.length,
      totalValue,
      lowStockItems,
      outOfStockItems,
      byMetalType
    })
  } catch (error) {
    console.error("Error fetching stock statistics:", error)
    res.status(500).json({ message: "Error fetching stock statistics" })
  }
}
