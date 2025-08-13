export default () => ({
  port: parseInt(process.env.PORT || '3000', 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  database: {
    type: process.env.NODE_ENV === 'development' ? 'sqlite' : 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.NODE_ENV === 'development' ? 'app/database.sqlite' : (process.env.DB_DATABASE || 'prop_t'),
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  
  email: {
    sendgridApiKey: process.env.SENDGRID_API_KEY,
    fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@prop-t.com',
  },
  
  upload: {
    maxSize: parseInt(process.env.UPLOAD_MAX_SIZE || '10485760', 10) || 10485760, // 10MB
    destination: process.env.UPLOAD_DEST || './uploads',
  },
  
  rateLimit: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL || '60000', 10) || 60000, // 1 minute
    limit: parseInt(process.env.RATE_LIMIT_MAX || '100', 10) || 100, // 100 requests
  },
});
