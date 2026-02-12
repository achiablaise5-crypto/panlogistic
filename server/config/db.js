/**
 * Database Configuration
 * MySQL Database Connection Setup
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Create and export MySQL connection pool
 * Uses connection pooling for better performance
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pan_logistics',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

/**
 * Test database connection
 * @returns {Promise<boolean>} Connection status
 */
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};

/**
 * Execute a query with parameters
 * @param {string} sql - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} Query results
 */
const query = async (sql, params = []) => {
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        console.error('Query error:', error.message);
        throw error;
    }
};

/**
 * Get a connection from the pool for transactions
 * @returns {Promise<Connection>} Database connection
 */
const getConnection = async () => {
    return await pool.getConnection();
};

module.exports = {
    pool,
    query,
    getConnection,
    testConnection
};
