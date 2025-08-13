# Prop-T Backend

A comprehensive NestJS backend for the Prop-T real estate property management system.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Complete user CRUD operations with profile management
- **Property Management**: Property listings with advanced filtering and search
- **Agent Management**: Real estate agent profiles and ratings
- **Property Verification**: Verification system with payment integration
- **Payment Processing**: Payment gateway integration for verification fees
- **API Documentation**: Comprehensive Swagger/OpenAPI documentation
- **Database**: TypeORM with SQLite (development) and MySQL (production) support
- **Security**: Input validation, rate limiting, and CORS protection

## 🏗️ Architecture

The application follows a modular architecture with clear separation of concerns:

- **Auth Module**: JWT authentication and user registration
- **Users Module**: User management and profiles
- **Properties Module**: Property listings and management
- **Agents Module**: Real estate agent management
- **Verification Module**: Property verification requests
- **Payments Module**: Payment processing and webhooks

## 📋 Prerequisites

- Node.js (v18 or higher)
- SQLite3 (for local development)
- MySQL (for production)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Application Configuration
   NODE_ENV=development
   PORT=3000
   FRONTEND_URL=http://localhost:3000

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # Payment Gateway Configuration
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

   # Email Configuration
   SENDGRID_API_KEY=your_sendgrid_api_key
   SENDGRID_FROM_EMAIL=noreply@prop-t.com

   # File Upload Configuration
   UPLOAD_MAX_SIZE=10485760
   UPLOAD_DEST=./uploads
   ```

4. **Database Setup**
   - **Development**: SQLite database will be automatically created in `app/database.sqlite`
   - **Production**: Create MySQL database:
     ```sql
     CREATE DATABASE prop_t CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
     ```

5. **Run the application**
   ```bash
   # Development mode (uses SQLite)
   npm run start:dev

   # Production build (uses MySQL)
   npm run build
   npm run start:prod
   ```

6. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

## 📚 API Documentation

Once the application is running, you can access the Swagger API documentation at:

```
http://localhost:3000/api
```

The documentation includes:
- All available endpoints
- Request/response schemas
- Authentication requirements
- Interactive testing interface

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register**: `POST /auth/register`
2. **Login**: `POST /auth/login`
3. **Use the returned token**: Include `Authorization: Bearer <token>` in subsequent requests

## 🗄️ Database Entities

### Users
- Basic user information (email, password, role)
- Profile details and preferences
- Role-based access control (user, agent, admin)

### Properties
- Property listings with detailed information
- Images, features, and specifications
- Verification status and ratings

### Agents
- Real estate agent profiles
- Agency information and specializations
- Ratings and experience

### Verification Requests
- Property verification submissions
- Document management
- Status tracking (pending, approved, rejected)

### Payments
- Payment processing for verification fees
- Multiple payment methods support
- Webhook integration for payment status updates

## 🚦 Available Scripts

- `npm run start`: Start the application
- `npm run start:dev`: Start in development mode with hot reload (SQLite)
- `npm run build`: Build the application for production
- `npm run start:prod`: Start the production build (MySQL)
- `npm run seed`: Populate database with sample data
- `npm run test`: Run unit tests
- `npm run test:e2e`: Run end-to-end tests
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## �� Configuration

### Database
- **Development**: Uses SQLite with automatic table creation (`synchronize: true`)
- **Production**: Uses MySQL with manual migrations (`synchronize: false`)

### Rate Limiting
API endpoints are protected with rate limiting (100 requests per minute).

### CORS
CORS is enabled with configurable origins for frontend integration.

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📁 Project Structure

```
src/
├── auth/                 # Authentication & JWT
├── users/               # User management
├── properties/          # Property listings
├── agents/              # Agent profiles
├── verification/        # Property verification
├── payments/            # Payment processing
├── common/              # Shared utilities
├── config/              # Configuration
├── database/            # Database seeding
└── app.module.ts        # Main application

app/
└── database.sqlite      # SQLite database file (development)
```

## 🔒 Security Features

- JWT authentication with configurable expiration
- Role-based access control
- Input validation with class-validator
- Rate limiting to prevent abuse
- CORS configuration
- Global exception handling

## 🌐 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Users
- `GET /users/profile` - Get current user profile
- `PATCH /users/profile` - Update current user profile
- `GET /users/:id` - Get user by ID
- `POST /users/:id/rate-agent` - Rate an agent

### Properties
- `GET /properties` - Get all properties with filtering
- `POST /properties` - Create new property
- `GET /properties/:id` - Get property by ID
- `PATCH /properties/:id` - Update property
- `DELETE /properties/:id` - Delete property
- `GET /properties/verified` - Get verified properties
- `GET /properties/my-properties` - Get user's properties

### Agents
- `GET /agents` - Get all agents
- `POST /agents` - Create agent profile
- `GET /agents/:id` - Get agent by ID
- `GET /agents/verified` - Get verified agents
- `GET /agents/my-profile` - Get current user's agent profile

### Verification
- `POST /verification` - Submit verification request
- `GET /verification/my-requests` - Get user's verification requests
- `GET /verification/pending` - Get pending requests (admin)
- `POST /verification/:id/approve` - Approve request (admin)
- `POST /verification/:id/reject` - Reject request (admin)

### Payments
- `POST /payments` - Create payment
- `GET /payments/stats` - Get payment statistics
- `POST /payments/:id/process` - Process payment webhook
- `POST /payments/:id/refund` - Refund payment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.
