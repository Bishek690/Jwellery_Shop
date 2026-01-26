import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Order, OrderItem } from '../entity/Order';
import { Product } from '../entity/Product';
import { User, UserRole } from '../entity/User';
import { Between, MoreThan } from 'typeorm';

// Get analytics overview
export const getAnalyticsOverview = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { timeRange = '6months' } = req.query;
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '1month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 6);
    }

    const orderRepository = AppDataSource.getRepository(Order);
    const userRepository = AppDataSource.getRepository(User);

    // Get total revenue
    const revenueResult = await orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.status IN (:...statuses)', { statuses: ['completed', 'delivered'] })
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();

    // Get total orders
    const totalOrders = await orderRepository.count({
      where: {
        createdAt: Between(startDate, endDate)
      }
    });

    // Get active customers
    const activeCustomers = await userRepository.count({
      where: {
        role: UserRole.CUSTOMER,
        createdAt: Between(startDate, endDate)
      }
    });

    // Get products sold
    const productsSoldResult = await AppDataSource.getRepository(OrderItem)
      .createQueryBuilder('item')
      .innerJoin('item.order', 'order')
      .select('SUM(item.quantity)', 'total')
      .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();

    return res.json({
      totalRevenue: parseFloat(revenueResult?.total || '0'),
      totalOrders,
      activeCustomers,
      productsSold: parseInt(productsSoldResult?.total || '0'),
      success: true
    });
  } catch (error) {
    console.error('Get analytics overview error:', error);
    return res.status(500).json({
      message: 'Error fetching analytics overview',
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    });
  }
};

// Get sales trend data
export const getSalesTrend = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { timeRange = '6months', groupBy = 'day' } = req.query;
    
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '1month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 6);
    }

    const orderRepository = AppDataSource.getRepository(Order);

    // Determine date format and grouping based on groupBy parameter
    let dateFormat: string;
    let dateField: string;
    
    switch (groupBy) {
      case 'year':
        dateFormat = '%Y';
        dateField = 'year';
        break;
      case 'month':
        dateFormat = '%Y-%m';
        dateField = 'period';
        break;
      case 'day':
      default:
        dateFormat = '%Y-%m-%d';
        dateField = 'period';
        break;
    }

    // Get sales data with dynamic grouping
    const salesData = await orderRepository
      .createQueryBuilder('order')
      .select(`DATE_FORMAT(order.createdAt, "${dateFormat}") as ${dateField}`)
      .addSelect('SUM(order.totalAmount)', 'sales')
      .addSelect('COUNT(order.id)', 'orders')
      .addSelect('COUNT(DISTINCT order.customerId)', 'customers')
      .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('order.status IN (:...statuses)', { statuses: ['completed', 'delivered'] })
      .groupBy(dateField)
      .orderBy(dateField, 'ASC')
      .getRawMany();

    // Format data based on grouping
    const formattedData = salesData.map(item => {
      let label: string;
      const periodValue = item[dateField];
      
      if (groupBy === 'year') {
        label = periodValue;
      } else if (groupBy === 'month') {
        label = new Date(periodValue + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      } else {
        // day format
        const date = new Date(periodValue);
        label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      
      return {
        period: label,
        sales: parseFloat(item.sales || '0'),
        orders: parseInt(item.orders || '0'),
        customers: parseInt(item.customers || '0')
      };
    });

    return res.json({
      data: formattedData,
      success: true
    });
  } catch (error) {
    console.error('Get sales trend error:', error);
    return res.status(500).json({
      message: 'Error fetching sales trend',
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    });
  }
};

// Get category distribution
export const getCategoryDistribution = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { timeRange = '6months' } = req.query;
    
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '1month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 6);
    }

    // Get sales by category
    const categoryData = await AppDataSource.getRepository(OrderItem)
      .createQueryBuilder('item')
      .innerJoin('item.order', 'order')
      .select('item.productCategory', 'name')
      .addSelect('SUM(item.quantity * item.price)', 'value')
      .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('order.status IN (:...statuses)', { statuses: ['completed', 'delivered'] })
      .andWhere('item.productCategory IS NOT NULL')
      .groupBy('item.productCategory')
      .getRawMany();

    // Calculate total for percentages
    const total = categoryData.reduce((sum, item) => sum + parseFloat(item.value || '0'), 0);

    // Format data with vibrant colors
    const colors = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#14B8A6', '#F97316'];
    const formattedData = categoryData.map((item, index) => ({
      name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
      value: Math.round((parseFloat(item.value || '0') / total) * 100),
      color: colors[index % colors.length]
    }));

    return res.json({
      data: formattedData,
      success: true
    });
  } catch (error) {
    console.error('Get category distribution error:', error);
    return res.status(500).json({
      message: 'Error fetching category distribution',
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    });
  }
};

// Get top products
export const getTopProducts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { timeRange = '6months', limit = 5 } = req.query;
    
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '1month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 6);
    }

    // Get top selling products
    const topProducts = await AppDataSource.getRepository(OrderItem)
      .createQueryBuilder('item')
      .innerJoin('item.order', 'order')
      .select('item.productName', 'name')
      .addSelect('SUM(item.quantity)', 'sales')
      .addSelect('SUM(item.quantity * item.price)', 'revenue')
      .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('order.status IN (:...statuses)', { statuses: ['completed', 'delivered'] })
      .groupBy('item.productName')
      .orderBy('revenue', 'DESC')
      .limit(parseInt(limit as string))
      .getRawMany();

    const formattedData = topProducts.map(item => ({
      name: item.name,
      sales: parseInt(item.sales || '0'),
      revenue: parseFloat(item.revenue || '0')
    }));

    return res.json({
      data: formattedData,
      success: true
    });
  } catch (error) {
    console.error('Get top products error:', error);
    return res.status(500).json({
      message: 'Error fetching top products',
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    });
  }
};
