import { Request, Response } from "express"
import { AppDataSource } from "../config/data-source"
import { SalesRecord } from "../entity/SalesRecord"
import { Like } from "typeorm"
import path from "path"
import fs from "fs"

const salesRecordRepository = AppDataSource.getRepository(SalesRecord)

// Get all sales records with filters
export const getSalesRecords = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = "", 
      saleType = "",
      paymentMethod = "",
      status = "",
      startDate = "",
      endDate = ""
    } = req.query

    const skip = (Number(page) - 1) * Number(limit)
    
    let whereConditions: any = {}
    
    if (search) {
      whereConditions = [
        { billNumber: Like(`%${search}%`) },
        { customerName: Like(`%${search}%`) },
        { customerPhone: Like(`%${search}%`) }
      ]
    }
    
    if (saleType && saleType !== "all") {
      whereConditions = { ...whereConditions, saleType }
    }

    if (paymentMethod && paymentMethod !== "all") {
      whereConditions = { ...whereConditions, paymentMethod }
    }

    if (status && status !== "all") {
      whereConditions = { ...whereConditions, status }
    }

    const queryBuilder = salesRecordRepository.createQueryBuilder("salesRecord")
      .leftJoinAndSelect("salesRecord.createdBy", "createdBy")
      .where(whereConditions)
      .skip(skip)
      .take(Number(limit))
      .orderBy("salesRecord.createdAt", "DESC")

    // Date range filter
    if (startDate) {
      queryBuilder.andWhere("salesRecord.createdAt >= :startDate", { startDate: new Date(startDate as string) })
    }
    if (endDate) {
      queryBuilder.andWhere("salesRecord.createdAt <= :endDate", { endDate: new Date(endDate as string) })
    }

    const [sales, total] = await queryBuilder.getManyAndCount()

    // Parse itemsData JSON for each sale
    const salesWithParsedItems = sales.map(sale => ({
      ...sale,
      items: JSON.parse(sale.itemsData || '[]'),
      createdBy: {
        id: sale.createdBy.id,
        name: sale.createdBy.name,
        email: sale.createdBy.email
      }
    }))

    res.json({
      sales: salesWithParsedItems,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    console.error("Error fetching sales records:", error)
    res.status(500).json({ message: "Error fetching sales records" })
  }
}

// Get single sales record
export const getSalesRecord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const sale = await salesRecordRepository.findOne({ 
      where: { id: Number(id) },
      relations: ['createdBy']
    })

    if (!sale) {
      return res.status(404).json({ message: "Sales record not found" })
    }

    res.json({
      ...sale,
      items: JSON.parse(sale.itemsData || '[]'),
      createdBy: {
        id: sale.createdBy.id,
        name: sale.createdBy.name,
        email: sale.createdBy.email
      }
    })
  } catch (error) {
    console.error("Error fetching sales record:", error)
    res.status(500).json({ message: "Error fetching sales record" })
  }
}

// Create new sales record
export const createSalesRecord = async (req: Request, res: Response) => {
  try {
    const { 
      billNumber, 
      customerName, 
      customerPhone, 
      customerEmail,
      customerAddress,
      saleType, 
      items, 
      subtotal, 
      discount, 
      tax, 
      totalAmount, 
      paymentMethod,
      status,
      notes 
    } = req.body

    const userId = (req as any).user?.id

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" })
    }

    // Validate required fields
    if (!billNumber || !customerName || !saleType || !items || !totalAmount || !paymentMethod) {
      return res.status(400).json({ message: "Please provide all required fields" })
    }

    // Check if bill number already exists
    const existingSale = await salesRecordRepository.findOne({ where: { billNumber } })
    if (existingSale) {
      return res.status(400).json({ message: "Bill number already exists" })
    }

    // Handle file upload if present
    let billImage: string | undefined = undefined
    if (req.file) {
      billImage = `/uploads/bills/${req.file.filename}`
    }

    const newSale = salesRecordRepository.create({
      billNumber,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      saleType,
      itemsData: JSON.stringify(items),
      subtotal: Number(subtotal),
      discount: Number(discount) || 0,
      tax: Number(tax) || 0,
      totalAmount: Number(totalAmount),
      paymentMethod,
      status: status || 'completed',
      billImage,
      notes,
      createdById: userId
    })

    const savedSale = await salesRecordRepository.save(newSale)

    res.status(201).json(savedSale)
  } catch (error) {
    console.error("Error creating sales record:", error)
    res.status(500).json({ message: "Error creating sales record" })
  }
}

// Update sales record
export const updateSalesRecord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { 
      customerName, 
      customerPhone, 
      customerEmail,
      customerAddress,
      items, 
      subtotal, 
      discount, 
      tax, 
      totalAmount, 
      paymentMethod,
      status,
      notes 
    } = req.body

    const sale = await salesRecordRepository.findOne({ where: { id: Number(id) } })

    if (!sale) {
      return res.status(404).json({ message: "Sales record not found" })
    }

    // Update fields
    if (customerName !== undefined) sale.customerName = customerName
    if (customerPhone !== undefined) sale.customerPhone = customerPhone
    if (customerEmail !== undefined) sale.customerEmail = customerEmail
    if (customerAddress !== undefined) sale.customerAddress = customerAddress
    if (items !== undefined) sale.itemsData = JSON.stringify(items)
    if (subtotal !== undefined) sale.subtotal = Number(subtotal)
    if (discount !== undefined) sale.discount = Number(discount)
    if (tax !== undefined) sale.tax = Number(tax)
    if (totalAmount !== undefined) sale.totalAmount = Number(totalAmount)
    if (paymentMethod !== undefined) sale.paymentMethod = paymentMethod
    if (status !== undefined) sale.status = status
    if (notes !== undefined) sale.notes = notes

    // Handle file upload if present
    if (req.file) {
      // Delete old bill image if exists
      if (sale.billImage) {
        const oldImagePath = path.join(process.cwd(), sale.billImage)
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath)
        }
      }
      sale.billImage = `/uploads/bills/${req.file.filename}`
    }

    const updatedSale = await salesRecordRepository.save(sale)

    res.json(updatedSale)
  } catch (error) {
    console.error("Error updating sales record:", error)
    res.status(500).json({ message: "Error updating sales record" })
  }
}

// Delete sales record
export const deleteSalesRecord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const sale = await salesRecordRepository.findOne({ where: { id: Number(id) } })

    if (!sale) {
      return res.status(404).json({ message: "Sales record not found" })
    }

    // Delete bill image if exists
    if (sale.billImage) {
      const imagePath = path.join(process.cwd(), sale.billImage)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    }

    await salesRecordRepository.remove(sale)

    res.json({ message: "Sales record deleted successfully" })
  } catch (error) {
    console.error("Error deleting sales record:", error)
    res.status(500).json({ message: "Error deleting sales record" })
  }
}

// Get sales statistics
export const getSalesStatistics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query

    const queryBuilder = salesRecordRepository.createQueryBuilder("salesRecord")

    // Date range filter
    if (startDate) {
      queryBuilder.andWhere("salesRecord.createdAt >= :startDate", { startDate: new Date(startDate as string) })
    }
    if (endDate) {
      queryBuilder.andWhere("salesRecord.createdAt <= :endDate", { endDate: new Date(endDate as string) })
    }

    const sales = await queryBuilder.getMany()

    const totalSales = sales.length
    const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.totalAmount), 0)
    const totalDiscount = sales.reduce((sum, sale) => sum + Number(sale.discount), 0)
    const totalTax = sales.reduce((sum, sale) => sum + Number(sale.tax), 0)

    // Group by sale type
    const bySaleType = sales.reduce((acc: any, sale) => {
      if (!acc[sale.saleType]) {
        acc[sale.saleType] = {
          count: 0,
          revenue: 0
        }
      }
      acc[sale.saleType].count += 1
      acc[sale.saleType].revenue += Number(sale.totalAmount)
      return acc
    }, {})

    // Group by payment method
    const byPaymentMethod = sales.reduce((acc: any, sale) => {
      if (!acc[sale.paymentMethod]) {
        acc[sale.paymentMethod] = {
          count: 0,
          amount: 0
        }
      }
      acc[sale.paymentMethod].count += 1
      acc[sale.paymentMethod].amount += Number(sale.totalAmount)
      return acc
    }, {})

    res.json({
      totalSales,
      totalRevenue,
      totalDiscount,
      totalTax,
      bySaleType,
      byPaymentMethod
    })
  } catch (error) {
    console.error("Error fetching sales statistics:", error)
    res.status(500).json({ message: "Error fetching sales statistics" })
  }
}
