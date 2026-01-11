import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { User, UserRole } from '../entity/User';

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
