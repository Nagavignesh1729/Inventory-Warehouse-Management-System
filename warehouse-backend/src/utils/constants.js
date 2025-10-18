// src/utils/constants.js

// Define user roles to be used throughout the application
const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  STAFF: 'STAFF',
};

// Define transaction types
const TRANSACTION_TYPES = ['IN', 'OUT', 'ADJUST'];

// Define transfer statuses
const TRANSFER_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED'];

module.exports = {
  ROLES,
  TRANSACTION_TYPES,
  TRANSFER_STATUSES,
};
