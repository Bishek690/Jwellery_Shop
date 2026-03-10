import { Request, Response } from "express"
import { AppDataSource } from "../config/data-source"
import { CreditDebit, TransactionType, EntityType } from "../entity/CreditDebit"
import { User, UserRole } from "../entity/User"
import { Between, In, Like } from "typeorm"

const creditDebitRepository = AppDataSource.getRepository(CreditDebit)
const userRepository = AppDataSource.getRepository(User)

// Get all credit/debit records with filters
export const getAllRecords = async (req: Request, res: Response) => {
  try {
    const { 
      customer_id, 
      type, 
      start_date, 
      end_date,
      payment_method,
      search,
      page = 1,
      limit = 50
    } = req.query

    const skip = (Number(page) - 1) * Number(limit)
    const where: any = {}

    if (customer_id) {
      where.customer_id = customer_id
    }

    if (type) {
      where.type = type
    }

    if (payment_method) {
      where.payment_method = payment_method
    }

    if (start_date && end_date) {
      where.transaction_date = Between(start_date, end_date)
    }

    const [records, total] = await creditDebitRepository.findAndCount({
      where,
      relations: ["customer", "recordedBy"],
      order: { transaction_date: "DESC", created_at: "DESC" },
      skip,
      take: Number(limit)
    })

    res.json({
      records,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    console.error("Error fetching records:", error)
    res.status(500).json({ message: "Failed to fetch records" })
  }
}

// Get customer balance
export const getCustomerBalance = async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.params

    const records = await creditDebitRepository.find({
      where: { customer_id },
      order: { transaction_date: "DESC", created_at: "DESC" }
    })

    let balance = 0
    records.forEach(record => {
      if (record.type === TransactionType.CREDIT) {
        balance += Number(record.amount)
      } else {
        balance -= Number(record.amount)
      }
    })

    const customer = await userRepository.findOne({
      where: { id: customer_id }
    })

    res.json({
      customer_id,
      customer_name: customer ? customer.name : "Unknown",
      balance,
      total_records: records.length
    })
  } catch (error) {
    console.error("Error fetching customer balance:", error)
    res.status(500).json({ message: "Failed to fetch customer balance" })
  }
}

// Get all customers with balances
export const getAllCustomerBalances = async (req: Request, res: Response) => {
  try {
    // Get customers only
    const customers = await userRepository.find({
      where: { role: UserRole.CUSTOMER },
      order: { name: "ASC" }
    })

    // Get manual entries
    const manualRecords = await creditDebitRepository.find({
      where: { entity_type: EntityType.MANUAL },
      select: ["manual_name", "manual_phone", "manual_email"]
    })

    // Get unique manual entries
    const uniqueManualEntries = Array.from(
      new Map(
        manualRecords
          .filter(r => r.manual_name)
          .map(r => [`${r.manual_name}-${r.manual_phone}`, r])
      ).values()
    )

    const balances = await Promise.all(
      customers.map(async (customer) => {
        const records = await creditDebitRepository.find({
          where: { 
            customer_id: customer.id,
            entity_type: EntityType.CUSTOMER
          }
        })

        let balance = 0
        records.forEach(record => {
          if (record.type === TransactionType.CREDIT) {
            balance += Number(record.amount)
          } else {
            balance -= Number(record.amount)
          }
        })

        return {
          customer_id: customer.id,
          customer_name: customer.name,
          email: customer.email,
          phone: customer.phone,
          entity_type: "customer",
          balance,
          total_records: records.length
        }
      })
    )

    // Add manual entries
    const manualBalances = await Promise.all(
      uniqueManualEntries.map(async (entry) => {
        const records = await creditDebitRepository.find({
          where: { 
            entity_type: EntityType.MANUAL,
            manual_name: entry.manual_name,
            manual_phone: entry.manual_phone || ""
          }
        })

        let balance = 0
        records.forEach(record => {
          if (record.type === TransactionType.CREDIT) {
            balance += Number(record.amount)
          } else {
            balance -= Number(record.amount)
          }
        })

        return {
          customer_id: null,
          customer_name: entry.manual_name || "Unknown",
          email: entry.manual_email,
          phone: entry.manual_phone,
          entity_type: "manual",
          balance,
          total_records: records.length
        }
      })
    )

    // Combine and filter
    const allBalances = [...balances, ...manualBalances].filter(b => b.total_records > 0)

    res.json({ balances: allBalances })
  } catch (error) {
    console.error("Error fetching customer balances:", error)
    res.status(500).json({ message: "Failed to fetch customer balances" })
  }
}

// Create a new record
export const createRecord = async (req: Request, res: Response) => {
  try {
    const { 
      entity_type,
      customer_id,
      manual_name,
      manual_phone,
      manual_email,
      type, 
      amount, 
      description, 
      payment_method,
      reference_number,
      transaction_date 
    } = req.body

    // Validate required fields
    if (!type || !amount || !transaction_date) {
      return res.status(400).json({ 
        message: "Type, amount, and transaction date are required" 
      })
    }

    // Validate entity type
    if (!entity_type || !Object.values(EntityType).includes(entity_type)) {
      return res.status(400).json({ 
        message: "Valid entity type is required (customer or manual)" 
      })
    }

    let finalCustomerId = customer_id
    let finalManualName = manual_name
    let finalManualPhone = manual_phone
    let finalManualEmail = manual_email
    let finalEntityType = entity_type

    // For manual entries, check if customer exists with same email or phone
    if (entity_type === EntityType.MANUAL) {
      if (!manual_name) {
        return res.status(400).json({ 
          message: "Name is required for manual entries" 
        })
      }

      // Check if a customer exists with the same email or phone
      let existingCustomer = null
      
      if (manual_email) {
        existingCustomer = await userRepository.findOne({
          where: { email: manual_email, role: UserRole.CUSTOMER }
        })
      }
      
      if (!existingCustomer && manual_phone) {
        existingCustomer = await userRepository.findOne({
          where: { phone: manual_phone, role: UserRole.CUSTOMER }
        })
      }

      // If customer exists, use customer data instead of manual
      if (existingCustomer) {
        finalEntityType = EntityType.CUSTOMER
        finalCustomerId = existingCustomer.id
        finalManualName = null
        finalManualPhone = null
        finalManualEmail = null
      }
    } else {
      // For customer entries, validate customer exists
      if (!customer_id) {
        return res.status(400).json({ 
          message: "Customer ID is required for customer entries" 
        })
      }

      const customer = await userRepository.findOne({
        where: { id: customer_id, role: UserRole.CUSTOMER }
      })

      if (!customer) {
        return res.status(404).json({ message: "Customer not found" })
      }
    }

    // Calculate current balance for this entity
    let whereClause: any = {}
    if (finalEntityType === EntityType.MANUAL) {
      whereClause = {
        entity_type: EntityType.MANUAL,
        manual_name: finalManualName,
        manual_phone: finalManualPhone || ""
      }
    } else {
      whereClause = {
        customer_id: finalCustomerId,
        entity_type: EntityType.CUSTOMER
      }
    }

    const existingRecords = await creditDebitRepository.find({
      where: whereClause,
      order: { transaction_date: "DESC", created_at: "DESC" }
    })

    let currentBalance = 0
    existingRecords.forEach(record => {
      if (record.type === TransactionType.CREDIT) {
        currentBalance += Number(record.amount)
      } else {
        currentBalance -= Number(record.amount)
      }
    })

    // Calculate new balance
    let newBalance = currentBalance
    if (type === TransactionType.CREDIT) {
      newBalance += Number(amount)
    } else {
      newBalance -= Number(amount)
    }

    const record = creditDebitRepository.create({
      entity_type: finalEntityType,
      customer_id: finalEntityType === EntityType.CUSTOMER ? finalCustomerId : null,
      manual_name: finalEntityType === EntityType.MANUAL ? finalManualName : null,
      manual_phone: finalEntityType === EntityType.MANUAL ? finalManualPhone : null,
      manual_email: finalEntityType === EntityType.MANUAL ? finalManualEmail : null,
      type,
      amount: Number(amount),
      description,
      payment_method,
      reference_number,
      transaction_date,
      balance: newBalance,
      recorded_by: (req as any).user?.id
    })

    await creditDebitRepository.save(record)

    const savedRecord = await creditDebitRepository.findOne({
      where: { id: record.id },
      relations: ["customer", "recordedBy"]
    })

    res.status(201).json({ 
      message: "Record created successfully", 
      record: savedRecord 
    })
  } catch (error) {
    console.error("Error creating record:", error)
    res.status(500).json({ message: "Failed to create record" })
  }
}

// Update a record
export const updateRecord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { 
      amount, 
      description, 
      payment_method,
      reference_number,
      transaction_date 
    } = req.body

    const record = await creditDebitRepository.findOne({
      where: { id }
    })

    if (!record) {
      return res.status(404).json({ message: "Record not found" })
    }

    // Update fields
    if (amount !== undefined) record.amount = Number(amount)
    if (description !== undefined) record.description = description
    if (payment_method !== undefined) record.payment_method = payment_method
    if (reference_number !== undefined) record.reference_number = reference_number
    if (transaction_date !== undefined) record.transaction_date = transaction_date

    // Recalculate balance for this customer
    const allRecords = await creditDebitRepository.find({
      where: { customer_id: record.customer_id },
      order: { transaction_date: "ASC", created_at: "ASC" }
    })

    let runningBalance = 0
    for (const rec of allRecords) {
      if (rec.type === TransactionType.CREDIT) {
        runningBalance += Number(rec.id === id ? amount : rec.amount)
      } else {
        runningBalance -= Number(rec.id === id ? amount : rec.amount)
      }
      
      if (rec.id === id) {
        rec.balance = runningBalance
      }
    }

    await creditDebitRepository.save(record)

    const updatedRecord = await creditDebitRepository.findOne({
      where: { id },
      relations: ["customer", "recordedBy"]
    })

    res.json({ 
      message: "Record updated successfully", 
      record: updatedRecord 
    })
  } catch (error) {
    console.error("Error updating record:", error)
    res.status(500).json({ message: "Failed to update record" })
  }
}

// Delete a record
export const deleteRecord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const record = await creditDebitRepository.findOne({
      where: { id }
    })

    if (!record) {
      return res.status(404).json({ message: "Record not found" })
    }

    await creditDebitRepository.remove(record)

    res.json({ message: "Record deleted successfully" })
  } catch (error) {
    console.error("Error deleting record:", error)
    res.status(500).json({ message: "Failed to delete record" })
  }
}

// Get record by ID
export const getRecordById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const record = await creditDebitRepository.findOne({
      where: { id },
      relations: ["customer", "recordedBy"]
    })

    if (!record) {
      return res.status(404).json({ message: "Record not found" })
    }

    res.json(record)
  } catch (error) {
    console.error("Error fetching record:", error)
    res.status(500).json({ message: "Failed to fetch record" })
  }
}

// Get statistics
export const getStatistics = async (req: Request, res: Response) => {
  try {
    const allRecords = await creditDebitRepository.find()

    let totalCredit = 0
    let totalDebit = 0
    let netBalance = 0

    allRecords.forEach(record => {
      if (record.type === TransactionType.CREDIT) {
        totalCredit += Number(record.amount)
        netBalance += Number(record.amount)
      } else {
        totalDebit += Number(record.amount)
        netBalance -= Number(record.amount)
      }
    })

    const totalRecords = allRecords.length
    const customersWithRecords = [...new Set(allRecords.map(r => r.customer_id))].length

    res.json({
      total_credit: totalCredit,
      total_debit: totalDebit,
      net_balance: netBalance,
      total_records: totalRecords,
      customers_with_records: customersWithRecords
    })
  } catch (error) {
    console.error("Error fetching statistics:", error)
    res.status(500).json({ message: "Failed to fetch statistics" })
  }
}
