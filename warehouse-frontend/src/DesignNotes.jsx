import React from 'react';

/**
 * Design System & Tokens for Inventory & Warehouse Management System
 * 
 * This file documents the complete design system including color tokens,
 * typography, spacing, components, and sample data schemas.
 */

const DesignNotes = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Design System Documentation</h1>
        <p className="text-gray-600">Comprehensive design tokens and guidelines for the Inventory & Warehouse Management System</p>
      </div>

      {/* Color System */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Color System</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Primary Colors */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Primary Palette</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg border border-blue-100"></div>
                <div>
                  <p className="font-medium">Blue 50</p>
                  <p className="text-sm text-gray-600">#eff6ff</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg"></div>
                <div>
                  <p className="font-medium">Blue 100</p>
                  <p className="text-sm text-gray-600">#dbeafe</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg"></div>
                <div>
                  <p className="font-medium">Blue 600 (Primary)</p>
                  <p className="text-sm text-gray-600">#2563eb</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-700 rounded-lg"></div>
                <div>
                  <p className="font-medium">Blue 700</p>
                  <p className="text-sm text-gray-600">#1d4ed8</p>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Colors */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Secondary & Accent Colors</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-teal-600 rounded-lg"></div>
                <div>
                  <p className="font-medium">Teal 600</p>
                  <p className="text-sm text-gray-600">#0d9488</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-600 rounded-lg"></div>
                <div>
                  <p className="font-medium">Orange 600</p>
                  <p className="text-sm text-gray-600">#ea580c</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg"></div>
                <div>
                  <p className="font-medium">Green 600</p>
                  <p className="text-sm text-gray-600">#16a34a</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg"></div>
                <div>
                  <p className="font-medium">Red 600</p>
                  <p className="text-sm text-gray-600">#dc2626</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg"></div>
                <div>
                  <p className="font-medium">Yellow 500</p>
                  <p className="text-sm text-gray-600">#eab308</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Colors */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Status Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-green-800 font-medium">Success/In Stock</div>
              <div className="text-green-600 text-sm">#16a34a</div>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-yellow-800 font-medium">Warning/Low Stock</div>
              <div className="text-yellow-600 text-sm">#eab308</div>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-red-800 font-medium">Error/Out of Stock</div>
              <div className="text-red-600 text-sm">#dc2626</div>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-gray-800 font-medium">Neutral</div>
              <div className="text-gray-600 text-sm">#6b7280</div>
            </div>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Typography</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Headings</h3>
            <div className="space-y-3">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Heading 1 - 3xl/Bold</h1>
                <p className="text-sm text-gray-600">48px, font-weight: 700, line-height: 1.2</p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Heading 2 - 2xl/Semibold</h2>
                <p className="text-sm text-gray-600">30px, font-weight: 600, line-height: 1.2</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900">Heading 3 - xl/Medium</h3>
                <p className="text-sm text-gray-600">20px, font-weight: 500, line-height: 1.2</p>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900">Heading 4 - lg/Medium</h4>
                <p className="text-sm text-gray-600">18px, font-weight: 500, line-height: 1.2</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Body Text</h3>
            <div className="space-y-3">
              <div>
                <p className="text-base text-gray-900">Body Large - 16px/Normal</p>
                <p className="text-sm text-gray-600">16px, font-weight: 400, line-height: 1.5</p>
              </div>
              <div>
                <p className="text-sm text-gray-900">Body Small - 14px/Normal</p>
                <p className="text-xs text-gray-600">14px, font-weight: 400, line-height: 1.5</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Caption - 12px/Normal</p>
                <p className="text-xs text-gray-500">12px, font-weight: 400, line-height: 1.4</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing System */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Spacing System (8px Base)</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-2 h-2 bg-blue-600 mx-auto mb-2"></div>
            <p className="text-sm font-medium">0.5 (2px)</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-blue-600 mx-auto mb-2"></div>
            <p className="text-sm font-medium">3 (12px)</p>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 bg-blue-600 mx-auto mb-2"></div>
            <p className="text-sm font-medium">4 (16px)</p>
          </div>
          <div className="text-center">
            <div className="w-6 h-6 bg-blue-600 mx-auto mb-2"></div>
            <p className="text-sm font-medium">6 (24px)</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-600 mx-auto mb-2"></div>
            <p className="text-sm font-medium">8 (32px)</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 mx-auto mb-2"></div>
            <p className="text-sm font-medium">12 (48px)</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 mx-auto mb-2"></div>
            <p className="text-sm font-medium">16 (64px)</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-600 mx-auto mb-2"></div>
            <p className="text-sm font-medium">20 (80px)</p>
          </div>
        </div>
      </section>

      {/* Component Specifications */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Component Specifications</h2>
        
        <div className="space-y-6">
          {/* Buttons */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Buttons</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Primary Button
                </button>
                <p className="text-xs text-gray-600 mt-2">Height: 40px, Padding: 16px, Radius: 8px</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
                  Secondary Button
                </button>
                <p className="text-xs text-gray-600 mt-2">Height: 40px, Padding: 16px, Radius: 8px</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <button className="text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
                  Text Button
                </button>
                <p className="text-xs text-gray-600 mt-2">Height: 40px, Padding: 16px, Radius: 8px</p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Form Fields</h3>
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Input Field</label>
              <input 
                type="text" 
                placeholder="Placeholder text"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-600 mt-2">Height: 40px, Padding: 12px, Radius: 6px, Border: 1px solid #d1d5db</p>
            </div>
          </div>

          {/* Cards */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cards</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-sm">
              <h4 className="font-medium text-gray-900">Card Title</h4>
              <p className="text-gray-600 text-sm mt-1">Card content with description</p>
              <div className="mt-4">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Badge</span>
              </div>
              <p className="text-xs text-gray-600 mt-4">Padding: 24px, Radius: 8px, Border: 1px solid #e5e7eb</p>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Breakpoints */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Responsive Breakpoints</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">Mobile</h3>
            <p className="text-sm text-gray-600">< 768px</p>
            <p className="text-xs text-gray-500 mt-1">Single column layout, stacked navigation</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">Tablet</h3>
            <p className="text-sm text-gray-600">768px - 1024px</p>
            <p className="text-xs text-gray-500 mt-1">8-column grid, collapsible sidebar</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">Desktop</h3>
            <p className="text-sm text-gray-600">1024px+</p>
            <p className="text-xs text-gray-500 mt-1">12-column grid, full sidebar navigation</p>
          </div>
        </div>
      </section>

      {/* Sample CSV Schema */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Sample CSV Schemas</h2>
        
        <div className="space-y-6">
          {/* Inventory Items CSV */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory Items CSV Format</h3>
            <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-800 whitespace-pre">
{`Item ID,Name,Category,Stock Level,Warehouse,Price,SKU,Description,Min Stock Level
INV001,iPhone 15 Pro,Electronics,45,Main Warehouse,999.99,APL-IP15P,"Latest iPhone model",10
INV002,Nike Air Force 1,Clothing,125,Fashion Store,89.99,NK-AF1-WHT,"Classic sneakers",20
INV003,The Great Gatsby,Books,67,Book Depot,12.99,BOOK-GG-001,"Classic literature",15`}
              </pre>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Column Specifications:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Required Columns:</strong></p>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>Name (text)</li>
                    <li>Category (text)</li>
                    <li>Stock Level (positive integer)</li>
                    <li>Warehouse (text, must match existing warehouse)</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Optional Columns:</strong></p>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>Item ID (auto-generated if empty)</li>
                    <li>Price (positive decimal)</li>
                    <li>SKU (alphanumeric)</li>
                    <li>Description (text)</li>
                    <li>Min Stock Level (positive integer)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Warehouses CSV */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Warehouses CSV Format</h3>
            <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-800 whitespace-pre">
{`Warehouse ID,Name,Location,Capacity,Manager,Address,Phone,Email,Status
WH001,Main Warehouse,"New York, NY","50,000 sq ft",John Smith,"123 Industrial Blvd, Queens, NY",(555) 123-4567,john@company.com,Active
WH002,Electronics Hub,"Los Angeles, CA","30,000 sq ft",Sarah Johnson,"456 Tech Ave, LA, CA",(555) 234-5678,sarah@company.com,Active`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Guidelines */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Accessibility Guidelines</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Color & Contrast</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Minimum contrast ratio of 4.5:1 for normal text</li>
              <li>Minimum contrast ratio of 3:1 for large text</li>
              <li>Never rely on color alone to convey information</li>
              <li>Use icons and text labels together</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Interaction & Navigation</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>All interactive elements must be keyboard accessible</li>
              <li>Focus indicators must be clearly visible</li>
              <li>Use proper ARIA labels for screen readers</li>
              <li>Maintain logical tab order</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
  );
};

export default DesignNotes;