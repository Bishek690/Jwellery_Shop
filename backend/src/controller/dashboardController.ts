import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { User, UserRole } from '../entity/User';
import { Order } from '../entity/Order';
import { Between } from 'typeorm';

export const getCustomerCount = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    
    const customerCount = await userRepository.count({
      where: { role: UserRole.CUSTOMER }
    });

    return res.json({
      count: customerCount,
      success: true
    });
  } catch (error) {
    console.error('Get customer count error:', error);
    return res.status(500).json({
      message: 'Error fetching customer count',
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    });
  }
};

export const getOrdersToday = async (req: Request, res: Response): Promise<Response> => {
  try {
    const orderRepository = AppDataSource.getRepository(Order);
    
    // Get start and end of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const ordersCount = await orderRepository.count({
      where: {
        createdAt: Between(today, tomorrow)
      }
    });

    return res.json({
      count: ordersCount,
      success: true
    });
  } catch (error) {
    console.error('Get orders today error:', error);
    return res.status(500).json({
      message: 'Error fetching orders today',
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false,
      count: 0
    });
  }
};

export const getTotalRevenue = async (req: Request, res: Response): Promise<Response> => {
  try {
    const orderRepository = AppDataSource.getRepository(Order);
    
    // Get total revenue from completed and delivered orders
    const result = await orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.status IN (:...statuses)', { statuses: ['completed', 'delivered'] })
      .andWhere('order.paymentStatus = :paymentStatus', { paymentStatus: 'paid' })
      .getRawOne();

    const totalRevenue = parseFloat(result?.total || '0');

    return res.json({
      total: totalRevenue,
      success: true
    });
  } catch (error) {
    console.error('Get total revenue error:', error);
    return res.status(500).json({
      message: 'Error fetching total revenue',
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false,
      total: 0
    });
  }
};

export const getDashboardStats = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const orderRepository = AppDataSource.getRepository(Order);
    
    // Get current month dates
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    
    // Get previous month dates
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    
    // Get today's dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Current month stats
    const currentUsers = await userRepository.count({
      where: {
        role: UserRole.CUSTOMER,
        createdAt: Between(currentMonthStart, currentMonthEnd)
      }
    });

    const currentRevenue = await orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.status IN (:...statuses)', { statuses: ['completed', 'delivered'] })
      .andWhere('order.paymentStatus = :paymentStatus', { paymentStatus: 'paid' })
      .andWhere('order.createdAt BETWEEN :start AND :end', { start: currentMonthStart, end: currentMonthEnd })
      .getRawOne();

    const currentOrders = await orderRepository.count({
      where: {
        createdAt: Between(currentMonthStart, currentMonthEnd)
      }
    });

    // Previous month stats
    const previousUsers = await userRepository.count({
      where: {
        role: UserRole.CUSTOMER,
        createdAt: Between(previousMonthStart, previousMonthEnd)
      }
    });

    const previousRevenue = await orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.status IN (:...statuses)', { statuses: ['completed', 'delivered'] })
      .andWhere('order.paymentStatus = :paymentStatus', { paymentStatus: 'paid' })
      .andWhere('order.createdAt BETWEEN :start AND :end', { start: previousMonthStart, end: previousMonthEnd })
      .getRawOne();

    const previousOrders = await orderRepository.count({
      where: {
        createdAt: Between(previousMonthStart, previousMonthEnd)
      }
    });

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const usersChange = calculateChange(currentUsers, previousUsers);
    const revenueChange = calculateChange(
      parseFloat(currentRevenue?.total || '0'),
      parseFloat(previousRevenue?.total || '0')
    );
    const ordersChange = calculateChange(currentOrders, previousOrders);

    // Get total counts
    const totalUsers = await userRepository.count({
      where: { role: UserRole.CUSTOMER }
    });

    const totalRevenue = await orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.status IN (:...statuses)', { statuses: ['completed', 'delivered'] })
      .andWhere('order.paymentStatus = :paymentStatus', { paymentStatus: 'paid' })
      .getRawOne();

    const ordersToday = await orderRepository.count({
      where: {
        createdAt: Between(today, tomorrow)
      }
    });

    return res.json({
      totalUsers,
      totalRevenue: parseFloat(totalRevenue?.total || '0'),
      ordersToday,
      changes: {
        users: Math.round(usersChange),
        revenue: Math.round(revenueChange),
        orders: Math.round(ordersChange),
      },
      success: true
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return res.status(500).json({
      message: 'Error fetching dashboard stats',
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    });
  }
};
