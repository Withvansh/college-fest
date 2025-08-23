#!/usr/bin/env node

/**
 * Migration Script for Unified Authentication System
 * 
 * This script helps migrate from the old multi-context auth system
 * to the new unified authentication system.
 * 
 * Usage: node migration-script.js
 */

const fs = require('fs');
const path = require('path');

// Files to update
const filesToUpdate = [
  // Add any remaining files that need migration
  'src/components/Navbar.tsx',
  'src/pages/ProfilePage.tsx',
  // Add more files as needed
];

// Replacements to make
const replacements = [
  // Import replacements
  {
    from: "import { useAuth } from '@/contexts/AuthContext';",
    to: "import { useAuth } from '@/hooks/useAuth';"
  },
  {
    from: "import { useLocalAuth } from '@/contexts/LocalAuthContext';",
    to: "import { useAuth } from '@/hooks/useAuth';"
  },
  {
    from: "import LocalProtectedRoute from '@/components/auth/LocalProtectedRoute';",
    to: "import UnifiedProtectedRoute from '@/components/auth/UnifiedProtectedRoute';"
  },
  
  // Component replacements
  {
    from: "<LocalProtectedRoute requiredRole={",
    to: "<UnifiedProtectedRoute allowedRoles={"
  },
  {
    from: "</LocalProtectedRoute>",
    to: "</UnifiedProtectedRoute>"
  },
  
  // Hook replacements
  {
    from: "const { login: authLogin, signup: authSignup",
    to: "const { login, signup"
  },
  {
    from: "const { login: localLogin",
    to: "const { demoLogin"
  },
  
  // Method call replacements
  {
    from: "authLogin(",
    to: "login("
  },
  {
    from: "authSignup(",
    to: "signup("
  },
  {
    from: "localLogin(",
    to: "demoLogin("
  }
];

function updateFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    replacements.forEach(({ from, to }) => {
      if (content.includes(from)) {
        content = content.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
        updated = true;
      }
    });
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
    } else {
      console.log(`ℹ️  No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

function main() {
  console.log('🚀 Starting Unified Auth Migration...\n');
  
  // Check if we're in the right directory
  if (!fs.existsSync('src')) {
    console.error('❌ Please run this script from the project root directory');
    process.exit(1);
  }
  
  // Update each file
  filesToUpdate.forEach(updateFile);
  
  console.log('\n✨ Migration complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Review the changes and test your application');
  console.log('2. Remove old auth context files if no longer needed');
  console.log('3. Update any remaining manual imports');
  console.log('4. Run `npm run build` to check for any TypeScript errors');
}

if (require.main === module) {
  main();
}

module.exports = { updateFile, replacements };
