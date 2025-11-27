/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  
  // Module paths
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Coverage
  collectCoverageFrom: [
    'src/lib/twilio/**/*.js',
    'src/app/api/sms/**/*.js',
    '!**/*.config.js',
    '!**/node_modules/**',
  ],

  // Transform
  transform: {
    '^.+\\.js$': ['babel-jest', { presets: ['next/babel'] }],
  },

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Module file extensions
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};

export default config;
