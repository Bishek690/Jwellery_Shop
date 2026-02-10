import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Product, ProductStatus } from "../entity/Product";
import { Repository } from "typeorm";
import { AuthRequest } from "../middleware/authMiddleware";
import { UserRole } from "../entity/User";

const productRepo = (): Repository<Product> => AppDataSource.getRepository(Product);

// Generate unique SKU
function generateSKU(category: string, name: string): string {
  const timestamp = Date.now().toString(36);
  const categoryPrefix = category.substring(0, 3).toUpperCase();
  const namePrefix = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
  return `${categoryPrefix}-${namePrefix}-${timestamp}`;
}

// Update product status based on stock
function updateProductStatus(product: Product): void {
  if (product.stock <= 0) {
    product.status = ProductStatus.OUT_OF_STOCK;
  } else if (product.stock <= product.minStock) {
    product.status = ProductStatus.LOW_STOCK;
  } else {
    product.status = ProductStatus.IN_STOCK;
  }
}

// Get all products (public endpoint for customers)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { 
      category, 
      status, 
      featured, 
      minPrice, 
      maxPrice, 
      metalType,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const queryBuilder = productRepo()
      .createQueryBuilder('product')
      .where('product.isActive = :isActive', { isActive: true });

    // Apply filters
    if (category) {
      queryBuilder.andWhere('product.category = :category', { category });
    }

    if (status) {
      queryBuilder.andWhere('product.status = :status', { status });
    }

    if (featured) {
      queryBuilder.andWhere('product.featured = :featured', { featured: featured === 'true' });
    }

    if (metalType) {
      queryBuilder.andWhere('product.metalType = :metalType', { metalType });
    }

    if (minPrice) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice: Number(minPrice) });
    }

    if (maxPrice) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: Number(maxPrice) });
    }

    if (search) {
      queryBuilder.andWhere(
        '(product.name LIKE :search OR product.description LIKE :search OR product.sku LIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Apply sorting
    queryBuilder.orderBy(`product.${sortBy}`, sortOrder as 'ASC' | 'DESC');

    // Apply pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    queryBuilder.skip((pageNum - 1) * limitNum).take(limitNum);

    const [products, total] = await queryBuilder.getManyAndCount();

    res.json({
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

// Get product by ID
export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await productRepo().findOne({
      where: { id: req.params.id, isActive: true }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error: any) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};

// Create product (admin/staff only)
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    // Check permissions
    if (!req.user || (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.STAFF)) {
      return res.status(403).json({ message: 'Access denied. Admin or staff role required.' });
    }

    const {
      name,
      description,
      category,
      price,
      cost,
      weight,
      metalType,
      purity,
      stock,
      minStock,
      featured = false,
      discountPrice,
      images,
      specifications
    } = req.body;

    // Validate required fields
    if (!name || !description || !category || !price || !cost || !weight || !metalType || !purity) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, description, category, price, cost, weight, metalType, purity' 
      });
    }

    // Validate discount price if provided
    if (discountPrice !== undefined && discountPrice !== null && discountPrice !== '') {
      const discountVal = Number(discountPrice);
      const priceVal = Number(price);
      
      if (isNaN(discountVal) || discountVal < 0) {
        return res.status(400).json({ 
          message: 'Discount price must be a positive number' 
        });
      }
      
      if (discountVal >= priceVal) {
        return res.status(400).json({ 
          message: 'Discount price must be less than the regular price' 
        });
      }
      
      const costVal = Number(cost);
      if (discountVal < costVal) {
        return res.status(400).json({ 
          message: 'Discount price should not be less than cost price to avoid losses' 
        });
      }
    }

    // Generate unique SKU
    const sku = generateSKU(category, name);

    // Handle uploaded image
    let imagePath = '';
    if (req.file) {
      imagePath = `/uploads/products/${req.file.filename}`;
    }

    // Create product
    const product = productRepo().create({
      name,
      description,
      category,
      price: Number(price),
      cost: Number(cost),
      weight: Number(weight),
      metalType,
      purity,
      stock: Number(stock) || 0,
      minStock: Number(minStock) || 5,
      featured: Boolean(featured),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      image: imagePath,
      images: images ? JSON.parse(images) : undefined,
      specifications: specifications ? JSON.parse(specifications) : undefined,
      sku,
      isActive: true
    });

    // Update status based on stock
    updateProductStatus(product);

    await productRepo().save(product);

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error: any) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
};

// Update product (admin/staff only)
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    // Check permissions
    if (!req.user || (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.STAFF)) {
      return res.status(403).json({ message: 'Access denied. Admin or staff role required.' });
    }

    const product = await productRepo().findOneBy({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const {
      name,
      description,
      category,
      price,
      cost,
      weight,
      metalType,
      purity,
      stock,
      minStock,
      featured,
      discountPrice,
      image,
      images,
      specifications,
      isActive
    } = req.body;

    // Validate discount price if provided
    if (discountPrice !== undefined && discountPrice !== null && discountPrice !== '') {
      const discountVal = Number(discountPrice);
      const priceVal = price !== undefined ? Number(price) : product.price;
      const costVal = cost !== undefined ? Number(cost) : product.cost;
      
      if (isNaN(discountVal) || discountVal < 0) {
        return res.status(400).json({ 
          message: 'Discount price must be a positive number' 
        });
      }
      
      if (discountVal >= priceVal) {
        return res.status(400).json({ 
          message: 'Discount price must be less than the regular price' 
        });
      }
      
      if (discountVal < costVal) {
        return res.status(400).json({ 
          message: 'Discount price should not be less than cost price to avoid losses' 
        });
      }
    }

    // Update fields
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (price !== undefined) product.price = Number(price);
    if (cost !== undefined) product.cost = Number(cost);
    if (weight !== undefined) product.weight = Number(weight);
    if (metalType !== undefined) product.metalType = metalType;
    if (purity !== undefined) product.purity = purity;
    if (stock !== undefined) product.stock = Number(stock);
    if (minStock !== undefined) product.minStock = Number(minStock);
    if (featured !== undefined) product.featured = Boolean(featured);
    if (discountPrice !== undefined) {
      product.discountPrice = discountPrice && discountPrice !== '' ? Number(discountPrice) : undefined;
    }
    
    // Handle uploaded image from multer middleware
    if (req.file) {
      product.image = `/uploads/products/${req.file.filename}`;
    }
    if (images !== undefined) product.images = typeof images === 'string' ? JSON.parse(images) : images;
    if (specifications !== undefined) product.specifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
    if (isActive !== undefined) product.isActive = Boolean(isActive);

    // Update status based on stock
    updateProductStatus(product);

    await productRepo().save(product);

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error: any) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};

// Delete product (admin/staff only)
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    // Check permissions
    if (!req.user || (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.STAFF)) {
      return res.status(403).json({ message: 'Access denied. Admin or staff role required.' });
    }

    const product = await productRepo().findOneBy({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Soft delete by setting isActive to false
    product.isActive = false;
    await productRepo().save(product);

    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};

// Get product statistics (admin/staff only)
export const getProductStats = async (req: AuthRequest, res: Response) => {
  try {
    // Check permissions
    if (!req.user || (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.STAFF)) {
      return res.status(403).json({ message: 'Access denied. Admin or staff role required.' });
    }

    const totalProducts = await productRepo().count({ where: { isActive: true } });
    const inStock = await productRepo().count({ where: { status: ProductStatus.IN_STOCK, isActive: true } });
    const lowStock = await productRepo().count({ where: { status: ProductStatus.LOW_STOCK, isActive: true } });
    const outOfStock = await productRepo().count({ where: { status: ProductStatus.OUT_OF_STOCK, isActive: true } });
    const featuredProducts = await productRepo().count({ where: { featured: true, isActive: true } });

    // Get total value
    const result = await productRepo()
      .createQueryBuilder('product')
      .select('SUM(product.price * product.stock)', 'totalValue')
      .where('product.isActive = :isActive', { isActive: true })
      .getRawOne();

    const totalValue = Number(result?.totalValue) || 0;

    // Get unique categories count
    const categoriesResult = await productRepo()
      .createQueryBuilder('product')
      .select('COUNT(DISTINCT product.category)', 'categories')
      .where('product.isActive = :isActive', { isActive: true })
      .getRawOne();

    const categories = Number(categoriesResult?.categories) || 0;

    // Get top categories by value
    const topCategoriesResult = await productRepo()
      .createQueryBuilder('product')
      .select('product.category', 'name')
      .addSelect('COUNT(product.id)', 'count')
      .addSelect('SUM(product.price * product.stock)', 'value')
      .where('product.isActive = :isActive', { isActive: true })
      .groupBy('product.category')
      .orderBy('SUM(product.price * product.stock)', 'DESC')
      .limit(5)
      .getRawMany();

    // Calculate total value for percentage calculation
    const topCategories = topCategoriesResult.map(cat => {
      const value = Number(cat.value) || 0;
      const percentage = totalValue > 0 ? Math.round((value / totalValue) * 100) : 0;
      return {
        name: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
        count: Number(cat.count) || 0,
        value: value,
        percentage: percentage
      };
    });

    res.json({
      totalProducts,
      inStock,
      lowStock,
      outOfStock,
      featuredProducts,
      totalValue,
      categories,
      topCategories
    });
  } catch (error: any) {
    console.error('Get product stats error:', error);
    res.status(500).json({ message: 'Failed to fetch product statistics', error: error.message });
  }
};
