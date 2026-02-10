import { Request, Response } from "express"
import { AppDataSource } from "../config/data-source"
import { Order, OrderStatus, PaymentStatus, OrderItem, OrderTracking } from "../entity/Order"
import { User, UserRole } from "../entity/User"
import { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail, sendPaymentConfirmationEmail } from "../utils/emailService"
import bcrypt from "bcryptjs"

export class OrderController {
  // Create new order
  static async createOrder(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id
      const {
        items,
        subtotal,
        shippingCost,
        totalAmount,
        paymentMethod,
        shippingInfo,
        notes,
      } = req.body

      // Validate required fields
      if (!items || items.length === 0) {
        return res.status(400).json({ message: "Order must contain at least one item" })
      }

      if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city) {
        return res.status(400).json({ message: "Missing required shipping information" })
      }

      const orderRepository = AppDataSource.getRepository(Order)
      const userRepository = AppDataSource.getRepository(User)

      // Get customer
      const customer = await userRepository.findOne({ where: { id: userId } })
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" })
      }

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

      // Create order
      const order = orderRepository.create({
        orderNumber,
        customer,
        customerId: userId,
        subtotal: parseFloat(String(subtotal)),
        shippingCost: parseFloat(String(shippingCost)),
        totalAmount: parseFloat(String(totalAmount)),
        paymentMethod,
        paymentStatus: paymentMethod === "cod" ? PaymentStatus.PENDING : PaymentStatus.PENDING,
        status: OrderStatus.PENDING,
        shippingName: shippingInfo.fullName,
        shippingPhone: shippingInfo.phone,
        shippingEmail: shippingInfo.email || null,
        shippingAddress: shippingInfo.address,
        shippingCity: shippingInfo.city,
        shippingState: shippingInfo.state || null,
        shippingZipCode: shippingInfo.zipCode || null,
        notes: notes || null,
        items: items.map((item: any) => {
          const parsedId = parseInt(String(item.id || 0))
          const parsedWeight = parseFloat(String(item.weight || 0))
          const parsedPrice = parseFloat(String(item.price || 0))
          const parsedDiscountPrice = item.discountPrice ? parseFloat(String(item.discountPrice)) : null
          const parsedQuantity = parseInt(String(item.quantity || 1))
          
          return {
            productId: isNaN(parsedId) ? 0 : parsedId,
            productName: item.name || "",
            productSku: item.sku || "",
            productCategory: item.category || null,
            productImage: item.image || null,
            metalType: item.metalType || "",
            purity: item.purity || "",
            weight: isNaN(parsedWeight) ? 0 : parsedWeight,
            price: isNaN(parsedPrice) ? 0 : parsedPrice,
            discountPrice: parsedDiscountPrice && !isNaN(parsedDiscountPrice) ? parsedDiscountPrice : null,
            quantity: isNaN(parsedQuantity) ? 1 : parsedQuantity,
            totalPrice: (item.discountPrice || item.price) * (item.quantity || 1),
          }
        }),
        tracking: [{
          status: OrderStatus.PENDING,
          notes: "Order placed successfully",
          updatedBy: customer,
          updatedById: userId,
        }],
      })

      await orderRepository.save(order)

      // Send order confirmation email
      try {
        await sendOrderConfirmationEmail({
          to: customer.email,
          name: customer.name,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          items: order.items,
          shippingInfo: {
            fullName: shippingInfo.fullName,
            address: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            zipCode: shippingInfo.zipCode,
            phone: shippingInfo.phone,
          },
        });
        console.log(`Order confirmation email sent to ${customer.email}`);
      } catch (emailError) {
        console.error("Failed to send order confirmation email:", emailError);
        // Don't fail the order creation if email fails
      }

      res.status(201).json({
        message: "Order placed successfully",
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          status: order.status,
        },
      })
    } catch (error) {
      console.error("Error creating order:", error)
      res.status(500).json({ message: "Error creating order", error: error instanceof Error ? error.message : "Unknown error" })
    }
  }

  // Get customer's orders
  static async getMyOrders(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id
      const orderRepository = AppDataSource.getRepository(Order)

      const orders = await orderRepository.find({
        where: { customerId: userId },
        relations: ["items", "tracking", "tracking.updatedBy"],
        order: { createdAt: "DESC" },
      })

      res.json(orders)
    } catch (error) {
      console.error("Error fetching orders:", error)
      res.status(500).json({ message: "Error fetching orders", error: error instanceof Error ? error.message : "Unknown error" })
    }
  }

  // Get single order by ID (customer)
  static async getOrderById(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id
      const orderId = parseInt(req.params.id)

      const orderRepository = AppDataSource.getRepository(Order)

      const order = await orderRepository.findOne({
        where: { id: orderId, customerId: userId },
        relations: ["items", "tracking", "tracking.updatedBy"],
      })

      if (!order) {
        return res.status(404).json({ message: "Order not found" })
      }

      res.json(order)
    } catch (error) {
      console.error("Error fetching order:", error)
      res.status(500).json({ message: "Error fetching order", error: error instanceof Error ? error.message : "Unknown error" })
    }
  }

  // Get all orders (admin/staff)
  static async getAllOrders(req: Request, res: Response) {
    try {
      const { status, page = 1, limit = 20 } = req.query
      const orderRepository = AppDataSource.getRepository(Order)

      const queryBuilder = orderRepository
        .createQueryBuilder("order")
        .leftJoinAndSelect("order.customer", "customer")
        .leftJoinAndSelect("order.items", "items")
        .leftJoinAndSelect("order.tracking", "tracking")
        .leftJoinAndSelect("tracking.updatedBy", "updatedBy")

      if (status) {
        queryBuilder.andWhere("order.status = :status", { status })
      }

      queryBuilder
        .orderBy("order.createdAt", "DESC")
        .skip((Number(page) - 1) * Number(limit))
        .take(Number(limit))

      const [orders, total] = await queryBuilder.getManyAndCount()

      res.json({
        orders,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      })
    } catch (error) {
      console.error("Error fetching orders:", error)
      res.status(500).json({ message: "Error fetching orders", error: error instanceof Error ? error.message : "Unknown error" })
    }
  }

  // Get single order (admin/staff)
  static async getOrderByIdAdmin(req: Request, res: Response) {
    try {
      const orderId = parseInt(req.params.id)
      const orderRepository = AppDataSource.getRepository(Order)

      const order = await orderRepository.findOne({
        where: { id: orderId },
        relations: ["customer", "items", "tracking", "tracking.updatedBy"],
      })

      if (!order) {
        return res.status(404).json({ message: "Order not found" })
      }

      res.json(order)
    } catch (error) {
      console.error("Error fetching order:", error)
      res.status(500).json({ message: "Error fetching order", error: error instanceof Error ? error.message : "Unknown error" })
    }
  }

  // Update order status (admin/staff)
  static async updateOrderStatus(req: Request, res: Response) {
    try {
      const orderId = parseInt(req.params.id)
      const userId = (req as any).user.id
      const { status, notes } = req.body

      if (!Object.values(OrderStatus).includes(status)) {
        return res.status(400).json({ message: "Invalid status" })
      }

      const orderRepository = AppDataSource.getRepository(Order)
      const trackingRepository = AppDataSource.getRepository(OrderTracking)

      const order = await orderRepository.findOne({
        where: { id: orderId },
        relations: ["tracking", "customer"],
      })

      if (!order) {
        return res.status(404).json({ message: "Order not found" })
      }

      // Define status hierarchy
      const statusHierarchy: { [key: string]: number } = {
        [OrderStatus.PENDING]: 0,
        [OrderStatus.CONFIRMED]: 1,
        [OrderStatus.PROCESSING]: 2,
        [OrderStatus.SHIPPED]: 3,
        [OrderStatus.DELIVERED]: 4,
        [OrderStatus.CANCELLED]: -1, // Special case
      }

      const currentStatusLevel = statusHierarchy[order.status]
      const newStatusLevel = statusHierarchy[status]

      // Prevent going back to a lower status (except for cancellation)
      if (order.status === OrderStatus.DELIVERED) {
        return res.status(400).json({ 
          message: "Cannot change status of delivered orders. Update payment status if needed." 
        })
      }

      if (order.status === OrderStatus.CANCELLED) {
        return res.status(400).json({ 
          message: "Cannot change status of cancelled orders" 
        })
      }

      if (newStatusLevel !== -1 && currentStatusLevel > newStatusLevel) {
        return res.status(400).json({ 
          message: `Cannot change status from ${order.status} back to ${status}` 
        })
      }

      // Update order status
      order.status = status
      await orderRepository.save(order)

      // Add tracking entry
      const tracking = trackingRepository.create({
        orderId,
        status,
        notes: notes || `Order status updated to ${status}`,
        updatedById: userId,
      })
      await trackingRepository.save(tracking)

      // Send order status update email
      try {
        await sendOrderStatusUpdateEmail({
          to: order.customer.email,
          name: order.customer.name,
          orderNumber: order.orderNumber,
          status: status,
          notes: notes,
        });
        console.log(`Order status update email sent to ${order.customer.email}`);
      } catch (emailError) {
        console.error("Failed to send order status update email:", emailError);
        // Don't fail the status update if email fails
      }

      res.json({ message: "Order status updated successfully", order })
    } catch (error) {
      console.error("Error updating order status:", error)
      res.status(500).json({ message: "Error updating order status", error: error instanceof Error ? error.message : "Unknown error" })
    }
  }

  // Update payment status (admin)
  static async updatePaymentStatus(req: Request, res: Response) {
    try {
      const orderId = parseInt(req.params.id)
      const { paymentStatus } = req.body

      if (!Object.values(PaymentStatus).includes(paymentStatus)) {
        return res.status(400).json({ message: "Invalid payment status" })
      }

      const orderRepository = AppDataSource.getRepository(Order)

      const order = await orderRepository.findOne({ 
        where: { id: orderId },
        relations: ["customer"],
      })

      if (!order) {
        return res.status(404).json({ message: "Order not found" })
      }

      const previousPaymentStatus = order.paymentStatus

      // Payment status can be updated at any time, especially important after delivery
      order.paymentStatus = paymentStatus
      await orderRepository.save(order)

      // Send payment confirmation email when status changes to "paid"
      console.log(`Payment status change: ${previousPaymentStatus} -> ${paymentStatus}`);
      console.log(`Should send email: ${paymentStatus === PaymentStatus.PAID && previousPaymentStatus !== PaymentStatus.PAID}`);
      
      if (paymentStatus === PaymentStatus.PAID && previousPaymentStatus !== PaymentStatus.PAID) {
        try {
          console.log(`Attempting to send payment confirmation email to ${order.customer.email}`);
          await sendPaymentConfirmationEmail({
            to: order.customer.email,
            name: order.customer.name,
            orderNumber: order.orderNumber,
            totalAmount: order.totalAmount,
            paymentMethod: order.paymentMethod,
          });
          console.log(`Payment confirmation email sent successfully to ${order.customer.email}`);
        } catch (emailError) {
          console.error("Failed to send payment confirmation email:", emailError);
          // Don't fail the payment status update if email fails
        }
      } else {
        console.log(`Skipping email: paymentStatus=${paymentStatus}, previousStatus=${previousPaymentStatus}, PAID=${PaymentStatus.PAID}`);
      }

      res.json({ message: "Payment status updated successfully", order })
    } catch (error) {
      console.error("Error updating payment status:", error)
      res.status(500).json({ message: "Error updating payment status", error: error instanceof Error ? error.message : "Unknown error" })
    }
  }

  // Get order statistics (admin)
  static async getOrderStats(req: Request, res: Response) {
    try {
      const orderRepository = AppDataSource.getRepository(Order)

      const totalOrders = await orderRepository.count()
      const pendingOrders = await orderRepository.count({ where: { status: OrderStatus.PENDING } })
      const confirmedOrders = await orderRepository.count({ where: { status: OrderStatus.CONFIRMED } })
      const processingOrders = await orderRepository.count({ where: { status: OrderStatus.PROCESSING } })
      const shippedOrders = await orderRepository.count({ where: { status: OrderStatus.SHIPPED } })
      const deliveredOrders = await orderRepository.count({ where: { status: OrderStatus.DELIVERED } })
      const cancelledOrders = await orderRepository.count({ where: { status: OrderStatus.CANCELLED } })

      const totalRevenue = await orderRepository
        .createQueryBuilder("order")
        .select("SUM(order.totalAmount)", "total")
        .where("order.status != :status", { status: OrderStatus.CANCELLED })
        .getRawOne()

      res.json({
        totalOrders,
        pendingOrders,
        confirmedOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue: totalRevenue.total || 0,
      })
    } catch (error) {
      console.error("Error fetching order stats:", error)
      res.status(500).json({ message: "Error fetching order stats", error: error instanceof Error ? error.message : "Unknown error" })
    }
  }

  // Cancel order (customer - only if pending)
  static async cancelOrder(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id
      const orderId = parseInt(req.params.id)
      const { reason } = req.body

      const orderRepository = AppDataSource.getRepository(Order)
      const trackingRepository = AppDataSource.getRepository(OrderTracking)

      const order = await orderRepository.findOne({
        where: { id: orderId, customerId: userId },
      })

      if (!order) {
        return res.status(404).json({ message: "Order not found" })
      }

      if (order.status !== OrderStatus.PENDING) {
        return res.status(400).json({ message: "Only pending orders can be cancelled" })
      }

      order.status = OrderStatus.CANCELLED
      await orderRepository.save(order)

      // Add tracking entry
      const tracking = trackingRepository.create({
        orderId,
        status: OrderStatus.CANCELLED,
        notes: reason || "Order cancelled by customer",
        updatedById: userId,
      })
      await trackingRepository.save(tracking)

      res.json({ message: "Order cancelled successfully", order })
    } catch (error) {
      console.error("Error cancelling order:", error)
      res.status(500).json({ message: "Error cancelling order", error: error instanceof Error ? error.message : "Unknown error" })
    }
  }

  // Create offline order (admin/staff)
  static async createOfflineOrder(req: Request, res: Response) {
    try {
      const staffUserId = (req as any).user.id
      const {
        customerId,
        customerInfo, // For new customers: { name, email, phone }
        items,
        subtotal,
        shippingCost,
        totalAmount,
        paymentMethod,
        paymentStatus,
        status,
        shippingInfo,
        notes,
      } = req.body

      // Validate required fields
      if (!items || items.length === 0) {
        return res.status(400).json({ message: "Order must contain at least one item" })
      }

      if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city) {
        return res.status(400).json({ message: "Missing required shipping information" })
      }

      const orderRepository = AppDataSource.getRepository(Order)
      const userRepository = AppDataSource.getRepository(User)

      let customer: User | null = null

      // If customerId is provided, use existing customer
      if (customerId) {
        customer = await userRepository.findOne({ where: { id: customerId } })
        if (!customer) {
          return res.status(404).json({ message: "Customer not found" })
        }
      } else if (customerInfo) {
        // Create new customer for offline order
        // First check by email
        let existingUser = await userRepository.findOne({ where: { email: customerInfo.email } })
        
        // If not found by email, check by phone (if phone exists)
        if (!existingUser && customerInfo.phone) {
          existingUser = await userRepository.findOne({ where: { phone: customerInfo.phone } })
        }
        
        if (existingUser) {
          customer = existingUser
        } else {
          // Create a basic customer account with hashed random password
          const randomPassword = Math.random().toString(36).slice(-8)
          const hashedPassword = await bcrypt.hash(randomPassword, 10)
          
          // Generate unique phone if not provided or already exists
          let uniquePhone = customerInfo.phone
          if (!uniquePhone || await userRepository.findOne({ where: { phone: uniquePhone } })) {
            // Generate a unique placeholder phone
            uniquePhone = `OFFLINE-${Date.now()}-${Math.floor(Math.random() * 10000)}`
          }
          
          customer = userRepository.create({
            name: customerInfo.name,
            email: customerInfo.email,
            phone: uniquePhone,
            password: hashedPassword, // Hashed random password (they can reset later)
            role: UserRole.CUSTOMER,
          })
          await userRepository.save(customer)
        }
      } else {
        return res.status(400).json({ message: "Either customerId or customerInfo is required" })
      }

      // Generate order number with OFFLINE prefix
      const orderNumber = `OFFLINE-${Date.now()}-${Math.floor(Math.random() * 1000)}`

      // Create order
      const order = orderRepository.create({
        orderNumber,
        customer,
        // customerId: customer.id,
        subtotal: parseFloat(String(subtotal)),
        shippingCost: parseFloat(String(shippingCost)),
        totalAmount: parseFloat(String(totalAmount)),
        paymentMethod: paymentMethod || "cod",
        paymentStatus: paymentStatus || PaymentStatus.PENDING,
        status: status || OrderStatus.CONFIRMED,
        shippingName: shippingInfo.fullName,
        shippingPhone: shippingInfo.phone,
        shippingEmail: shippingInfo.email || null,
        shippingAddress: shippingInfo.address,
        shippingCity: shippingInfo.city,
        shippingState: shippingInfo.state || null,
        shippingZipCode: shippingInfo.zipCode || null,
        notes: notes ? `[OFFLINE ORDER] ${notes}` : "[OFFLINE ORDER]",
        items: items.map((item: any) => {
          const parsedId = parseInt(String(item.id || 0))
          const parsedWeight = parseFloat(String(item.weight || 0))
          const parsedPrice = parseFloat(String(item.price || 0))
          const parsedDiscountPrice = item.discountPrice ? parseFloat(String(item.discountPrice)) : null
          const parsedQuantity = parseInt(String(item.quantity || 1))
          
          // For custom products (with very large IDs from Date.now()), set productId to 0
          const productId = isNaN(parsedId) ? 0 : (parsedId > 2147483647 ? 0 : parsedId)
          
          return {
            productId: productId,
            productName: item.name || "",
            productSku: item.sku || "",
            productCategory: item.category || null,
            productImage: item.image || null,
            metalType: item.metalType || "",
            purity: item.purity || "",
            weight: isNaN(parsedWeight) ? 0 : parsedWeight,
            price: isNaN(parsedPrice) ? 0 : parsedPrice,
            discountPrice: parsedDiscountPrice && !isNaN(parsedDiscountPrice) ? parsedDiscountPrice : null,
            quantity: isNaN(parsedQuantity) ? 1 : parsedQuantity,
            totalPrice: (item.discountPrice || item.price) * (item.quantity || 1),
          }
        }),
        tracking: [{
          status: status || OrderStatus.CONFIRMED,
          notes: notes ? `Offline order created: ${notes}` : "Offline order created by staff",
          updatedBy: await userRepository.findOne({ where: { id: staffUserId } }) || undefined,
          updatedById: staffUserId,
        }],
      })

      await orderRepository.save(order)

      res.status(201).json({
        message: "Offline order created successfully",
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          status: order.status,
          customer: {
            id: customer.id,
            name: customer.name,
            email: customer.email,
          },
        },
      })
    } catch (error) {
      console.error("Error creating offline order:", error)
      res.status(500).json({ message: "Error creating offline order", error: error instanceof Error ? error.message : "Unknown error" })
    }
  }
}
