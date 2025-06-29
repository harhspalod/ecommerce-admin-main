import initSqlJs from 'sql.js';
import { nanoid } from 'nanoid';

let db: any = null;
let SQL: any = null;

// Initialize SQL.js
export async function initializeDatabase() {
  if (db) return db;

  try {
    // Initialize SQL.js
    SQL = await initSqlJs({
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`
    });

    // Create a new database
    db = new SQL.Database();

    // Create tables
    createTables();
    
    console.log('Database initialized successfully with SQL.js');
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

function createTables() {
  if (!db) return;

  // Products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Customers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Customer Products (relationship table)
  db.exec(`
    CREATE TABLE IF NOT EXISTS customer_products (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
    )
  `);

  // Coupons table
  db.exec(`
    CREATE TABLE IF NOT EXISTS coupons (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      product_id TEXT NOT NULL,
      discount_percentage REAL NOT NULL,
      valid_from DATETIME DEFAULT CURRENT_TIMESTAMP,
      valid_until DATETIME NOT NULL,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
    )
  `);

  // Chat messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      user_message TEXT NOT NULL,
      ai_response TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Social media posts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS social_posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      platform TEXT NOT NULL,
      product_id TEXT,
      image_url TEXT,
      scheduled_at DATETIME,
      posted_at DATETIME,
      status TEXT DEFAULT 'draft',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE SET NULL
    )
  `);

  // Insert sample data
  insertSampleData();
}

function insertSampleData() {
  if (!db) return;

  // Check if we already have data
  const result = db.exec("SELECT COUNT(*) as count FROM products");
  if (result[0]?.values[0][0] > 0) return; // Data already exists

  // Sample products
  const sampleProducts = [
    { id: nanoid(), name: "Wireless Headphones", description: "High-quality wireless headphones with noise cancellation", price: 99.99, stock: 50 },
    { id: nanoid(), name: "Smart Watch", description: "Feature-rich smartwatch with health tracking", price: 199.99, stock: 30 },
    { id: nanoid(), name: "Laptop Stand", description: "Ergonomic laptop stand for better posture", price: 49.99, stock: 75 },
    { id: nanoid(), name: "USB-C Hub", description: "Multi-port USB-C hub with HDMI and USB ports", price: 39.99, stock: 100 },
    { id: nanoid(), name: "Bluetooth Speaker", description: "Portable Bluetooth speaker with excellent sound quality", price: 79.99, stock: 25 }
  ];

  sampleProducts.forEach(product => {
    db.run(
      "INSERT INTO products (id, name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)",
      [product.id, product.name, product.description, product.price, product.stock, "https://via.placeholder.com/300x200"]
    );
  });

  // Sample customers
  const sampleCustomers = [
    { id: nanoid(), name: "John Doe", email: "john@example.com", phone: "+1234567890", address: "123 Main St, City, State" },
    { id: nanoid(), name: "Jane Smith", email: "jane@example.com", phone: "+1234567891", address: "456 Oak Ave, City, State" },
    { id: nanoid(), name: "Bob Johnson", email: "bob@example.com", phone: "+1234567892", address: "789 Pine Rd, City, State" }
  ];

  sampleCustomers.forEach(customer => {
    db.run(
      "INSERT INTO customers (id, name, email, phone, address) VALUES (?, ?, ?, ?, ?)",
      [customer.id, customer.name, customer.email, customer.phone, customer.address]
    );
  });

  console.log('Sample data inserted successfully');
}

// Helper functions for database operations
export async function getDatabase() {
  if (!db) {
    await initializeDatabase();
  }
  return db;
}

export async function executeQuery(query: string, params: any[] = []) {
  const database = await getDatabase();
  try {
    const stmt = database.prepare(query);
    const result = stmt.getAsObject(params);
    return result;
  } catch (error) {
    console.error('Query execution error:', error);
    throw error;
  }
}

export async function executeSelect(query: string, params: any[] = []) {
  const database = await getDatabase();
  try {
    const stmt = database.prepare(query);
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  } catch (error) {
    console.error('Select query error:', error);
    throw error;
  }
}

export async function executeInsert(query: string, params: any[] = []) {
  const database = await getDatabase();
  try {
    database.run(query, params);
    return { success: true };
  } catch (error) {
    console.error('Insert query error:', error);
    throw error;
  }
}

export async function executeUpdate(query: string, params: any[] = []) {
  const database = await getDatabase();
  try {
    database.run(query, params);
    return { success: true, changes: 1 }; // SQL.js doesn't return changes count
  } catch (error) {
    console.error('Update query error:', error);
    throw error;
  }
}

export async function executeDelete(query: string, params: any[] = []) {
  const database = await getDatabase();
  try {
    database.run(query, params);
    return { success: true, changes: 1 }; // SQL.js doesn't return changes count
  } catch (error) {
    console.error('Delete query error:', error);
    throw error;
  }
}

export default { getDatabase, executeQuery, executeSelect, executeInsert, executeUpdate, executeDelete };