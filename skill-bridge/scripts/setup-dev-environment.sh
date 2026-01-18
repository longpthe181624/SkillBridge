#!/bin/bash

# Development Environment Setup Script
# This script sets up the development environment for the Skill Bridge project

set -e  # Exit on any error

echo "🚀 Setting up Skill Bridge development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running on Windows
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    IS_WINDOWS=true
else
    IS_WINDOWS=false
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check Git
if command_exists git; then
    print_success "Git is installed: $(git --version)"
else
    print_error "Git is not installed. Please install Git first."
    exit 1
fi

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    print_success "Node.js is installed: $NODE_VERSION"
    
    # Check if Node.js version is 16 or higher
    NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR_VERSION" -lt 16 ]; then
        print_warning "Node.js version $NODE_VERSION is detected. Version 16 or higher is recommended."
    fi
else
    print_error "Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Check npm
if command_exists npm; then
    print_success "npm is installed: $(npm --version)"
else
    print_error "npm is not installed. Please install npm."
    exit 1
fi

# Create project structure
print_status "Creating project structure..."

# Create directories
mkdir -p src/{components,pages,services,utils,types}
mkdir -p tests/{unit,integration,e2e}
mkdir -p docs/{workflow,standards,templates}
mkdir -p scripts
mkdir -p public
mkdir -p config

print_success "Project structure created"

# Initialize package.json if it doesn't exist
if [ ! -f "package.json" ]; then
    print_status "Initializing package.json..."
    npm init -y
    
    # Update package.json with project information
    cat > package.json << EOF
{
  "name": "skill-bridge",
  "version": "1.0.0",
  "description": "Skill Bridge - A platform for connecting skills and opportunities",
  "main": "index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write src/",
    "build": "webpack --mode production",
    "build:dev": "webpack --mode development"
  },
  "keywords": ["skills", "bridge", "platform", "opportunities"],
  "author": "Skill Bridge Team",
  "license": "MIT",
  "devDependencies": {},
  "dependencies": {}
}
EOF
    print_success "package.json initialized"
fi

# Install development dependencies
print_status "Installing development dependencies..."

# Core development dependencies
npm install --save-dev \
    jest \
    @types/jest \
    eslint \
    prettier \
    nodemon \
    webpack \
    webpack-cli \
    typescript \
    @types/node

print_success "Development dependencies installed"

# Install production dependencies
print_status "Installing production dependencies..."

# Core production dependencies
npm install \
    express \
    cors \
    helmet \
    dotenv \
    bcryptjs \
    jsonwebtoken \
    mongoose \
    axios

print_success "Production dependencies installed"

# Create configuration files
print_status "Creating configuration files..."

# Create .env template
cat > .env.example << EOF
# Environment Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DATABASE_URL=mongodb://localhost:27017/skill-bridge

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# API Configuration
API_BASE_URL=http://localhost:3000/api

# External Services
EXTERNAL_API_URL=https://api.example.com
EXTERNAL_API_KEY=your-api-key-here
EOF

# Create .gitignore
cat > .gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/
*.tgz
*.tar.gz

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
EOF

# Create ESLint configuration
cat > .eslintrc.js << EOF
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error',
    'prefer-const': 'error',
    'no-var': 'error'
  }
};
EOF

# Create Prettier configuration
cat > .prettierrc << EOF
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
EOF

# Create Jest configuration
cat > jest.config.js << EOF
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};
EOF

# Create TypeScript configuration
cat > tsconfig.json << EOF
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "tests", "dist"]
}
EOF

print_success "Configuration files created"

# Create basic project files
print_status "Creating basic project files..."

# Create main application file
cat > src/index.js << EOF
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Skill Bridge API',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: 'The requested route does not exist'
  });
});

app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
  console.log(\`📚 API Documentation: http://localhost:\${PORT}/api/docs\`);
});

module.exports = app;
EOF

# Create test setup file
cat > tests/setup.js << EOF
// Test setup file
// This file is run before each test file

// Set test environment
process.env.NODE_ENV = 'test';

// Global test utilities
global.testUtils = {
  // Add any global test utilities here
};
EOF

# Create sample test
cat > tests/unit/app.test.js << EOF
const request = require('supertest');
const app = require('../../src/index');

describe('App', () => {
  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('status');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
EOF

print_success "Basic project files created"

# Create development scripts
print_status "Creating development scripts..."

# Create start script
cat > scripts/start.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Skill Bridge application..."
npm start
EOF

# Create test script
cat > scripts/test.sh << 'EOF'
#!/bin/bash
echo "🧪 Running tests..."
npm test
EOF

# Create lint script
cat > scripts/lint.sh << 'EOF'
#!/bin/bash
echo "🔍 Running linter..."
npm run lint
EOF

# Make scripts executable
chmod +x scripts/*.sh

print_success "Development scripts created"

# Final setup
print_status "Finalizing setup..."

# Install additional development tools
npm install --save-dev supertest

print_success "Additional development tools installed"

# Create README for development
cat > DEVELOPMENT.md << EOF
# Development Guide

## 🚀 Quick Start

1. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Set up environment**:
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

3. **Start development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

## 🧪 Testing

- **Run tests**: \`npm test\`
- **Run tests with coverage**: \`npm run test:coverage\`
- **Run tests in watch mode**: \`npm run test:watch\`

## 🔍 Code Quality

- **Lint code**: \`npm run lint\`
- **Fix linting issues**: \`npm run lint:fix\`
- **Format code**: \`npm run format\`

## 📚 Documentation

- **Workflow Guide**: [docs/workflow/README.md](docs/workflow/README.md)
- **Coding Standards**: [docs/standards/README.md](docs/standards/README.md)
- **Templates**: [docs/templates/README.md](docs/templates/README.md)

## 🛠️ Available Scripts

- \`npm start\` - Start production server
- \`npm run dev\` - Start development server with auto-reload
- \`npm test\` - Run test suite
- \`npm run lint\` - Run linter
- \`npm run format\` - Format code with Prettier
- \`npm run build\` - Build for production

## 📁 Project Structure

\`\`\`
skill-bridge/
├── src/                    # Source code
├── tests/                  # Test files
├── docs/                   # Documentation
├── scripts/                # Development scripts
├── config/                 # Configuration files
└── public/                 # Static assets
\`\`\`
EOF

print_success "Development guide created"

# Summary
echo ""
print_success "🎉 Development environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Copy .env.example to .env and configure your environment"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000 to see your application"
echo "4. Run 'npm test' to run the test suite"
echo "5. Check the documentation in the docs/ directory"
echo ""
echo "📚 Documentation:"
echo "- Workflow Guide: docs/workflow/README.md"
echo "- Coding Standards: docs/standards/README.md"
echo "- Development Guide: DEVELOPMENT.md"
echo ""
print_success "Happy coding! 🚀"
