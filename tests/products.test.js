const { mockDb, mockProducts, mockModel } = require('./db.mock');
const { list, get, destroy } = require('../products');

// Mock the db module to use our mockDb
jest.mock('../db', () => mockDb);

describe('list', () => {
  it('should list products', async () => {
    const products = await list();
    expect(products.length).toBe(2);
    expect(products[0].description).toBe('Product 1');
    expect(products[1].description).toBe('Product 2');
  });
});

describe('get', () => {
  it('should get a product by id', async () => {
    // Mock the Product.findById method to return a specific product
    mockModel.findById = jest.fn().mockResolvedValue({ description: 'Product 1' });

    // Call to get the product using the `get` method
    const product = await get('someProductId');

    // Assertions
    expect(mockModel.findById).toHaveBeenCalledWith('someProductId');
    expect(product).toBeDefined();
    expect(product.description).toBe('Product 1');
  });

  it('should return null if product not found', async () => {
    // Mock the Product.findById method to return null
    mockModel.findById = jest.fn().mockResolvedValue(null);

    // Call to get the product using the `get` method
    const product = await get('unknownProductId');

    // Assertions
    expect(mockModel.findById).toHaveBeenCalledWith('unknownProductId');
    expect(product).toBeNull();
  });
});

describe('destroy', () => {
  it('should delete a product by id', async () => {
    // Mock the Product.deleteOne method to return a deletedCount of 1
    mockModel.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });

    // Call to destroy the product
    const result = await destroy('someProductId');

    // Assertions
    expect(mockModel.deleteOne).toHaveBeenCalledWith({ _id: 'someProductId' });
    expect(result.deletedCount).toBe(1);
  });

  it('should return deletedCount 0 if product does not exist', async () => {
    // Mock the Product.deleteOne method to return a deletedCount of 0
    mockModel.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 0 });

    // Call to destroy the product
    const result = await destroy('unknownProductId');

    // Assertions
    expect(mockModel.deleteOne).toHaveBeenCalledWith({ _id: 'unknownProductId' });
    expect(result.deletedCount).toBe(0);
  });
});