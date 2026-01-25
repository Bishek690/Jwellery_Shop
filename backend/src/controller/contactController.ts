import { Request, Response } from "express"
import { AppDataSource } from "../config/data-source"
import { Contact } from "../entity/Contact"

// Create a new contact (public endpoint)
export const createContact = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        message: "Name, email, and message are required" 
      })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: "Invalid email format" 
      })
    }

    const contactRepository = AppDataSource.getRepository(Contact)

    const contact = contactRepository.create({
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
      status: "pending"
    })

    await contactRepository.save(contact)

    res.status(201).json({
      message: "Contact message submitted successfully. We'll get back to you soon!",
      contact: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        createdAt: contact.createdAt
      }
    })
  } catch (error) {
    console.error("Error creating contact:", error)
    res.status(500).json({ 
      message: "Failed to submit contact message. Please try again." 
    })
  }
}

// Get all contacts (admin only)
export const getAllContacts = async (req: Request, res: Response) => {
  try {
    const contactRepository = AppDataSource.getRepository(Contact)

    const contacts = await contactRepository.find({
      order: { createdAt: "DESC" }
    })

    res.json(contacts)
  } catch (error) {
    console.error("Error fetching contacts:", error)
    res.status(500).json({ 
      message: "Failed to fetch contacts" 
    })
  }
}

// Update contact status (admin only)
export const updateContactStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!["pending", "responded", "archived"].includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status. Must be: pending, responded, or archived" 
      })
    }

    const contactRepository = AppDataSource.getRepository(Contact)
    const contact = await contactRepository.findOne({ where: { id: parseInt(id) } })

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" })
    }

    contact.status = status
    await contactRepository.save(contact)

    res.json({
      message: "Contact status updated successfully",
      contact
    })
  } catch (error) {
    console.error("Error updating contact status:", error)
    res.status(500).json({ 
      message: "Failed to update contact status" 
    })
  }
}

// Delete contact (admin only)
export const deleteContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const contactRepository = AppDataSource.getRepository(Contact)
    const contact = await contactRepository.findOne({ where: { id: parseInt(id) } })

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" })
    }

    await contactRepository.remove(contact)

    res.json({ message: "Contact deleted successfully" })
  } catch (error) {
    console.error("Error deleting contact:", error)
    res.status(500).json({ 
      message: "Failed to delete contact" 
    })
  }
}
