import Link from 'next/link'

export default function DesignPatternsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">SkillBridge Design Patterns</h1>
              <p className="text-gray-600 mt-2">UI/UX Design System & Component Library</p>
            </div>
            <div className="text-sm text-gray-500">
              Version 2.0 • December 2024
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Design System Overview</h2>
            <p className="text-gray-600 mb-6">
              This design system provides comprehensive UI patterns for the SkillBridge platform, 
              built with shadcn/ui components for maximum reusability and consistency.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Client Portal Theme</h3>
                <p className="text-blue-600 text-sm mb-4">
                  Blue theme designed for client-facing interfaces with professional, 
                  trustworthy appearance using shadcn/ui components.
                </p>
                <div className="flex space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <div className="w-4 h-4 bg-blue-400 rounded"></div>
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <div className="w-4 h-4 bg-blue-700 rounded"></div>
                </div>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">Admin/Sales Theme</h3>
                <p className="text-orange-600 text-sm mb-4">
                  Orange theme optimized for internal operations with clear hierarchy 
                  and efficient workflows using shadcn/ui components.
                </p>
                <div className="flex space-x-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <div className="w-4 h-4 bg-gray-600 rounded"></div>
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Design Pattern Pages */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Design Pattern Pages</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Client Portal Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Client Portal</h3>
                <p className="text-blue-100">
                  Blue theme for client-facing interfaces
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Hero sections with blue gradients</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Contact forms and engineer profiles</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Data tables with blue accents</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Status badges and pagination</span>
                  </div>
                </div>
                
                <Link 
                  href="/design-patterns/client"
                  className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <span>View Client Portal</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Admin/Sales Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-orange-700 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Admin/Sales Portal</h3>
                <p className="text-orange-100">
                  Orange theme for internal operations
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-600">Dashboard with statistics cards</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-600">Sidebar navigation and forms</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-600">Data tables with orange accents</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-600">Status management and actions</span>
                  </div>
                </div>
                
                <Link 
                  href="/design-patterns/admin"
                  className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <span>View Admin Portal</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Component Library */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Component Library</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Buttons</h3>
                <div className="space-y-2">
                  <button className="w-full bg-blue-500 text-white py-2 px-4 rounded">Primary</button>
                  <button className="w-full bg-blue-600/50 text-white py-2 px-4 rounded border border-blue-400/50">Secondary</button>
                  <button className="w-full bg-orange-500 text-white py-2 px-4 rounded">Admin Primary</button>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Status Badges</h3>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Active</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Pending</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">High</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">New</span>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Form Elements</h3>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="Text input" 
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm">
                    <option>Select option</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Usage Guidelines</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Client Portal</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Use blue gradient backgrounds for hero sections</li>
                  <li>• White text on blue backgrounds for contrast</li>
                  <li>• Blue accent colors for buttons and links</li>
                  <li>• Professional, trustworthy appearance</li>
                  <li>• Focus on client-facing functionality</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Admin/Sales Portal</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Use orange accents for primary actions</li>
                  <li>• Grey sidebar for navigation</li>
                  <li>• White backgrounds for content areas</li>
                  <li>• Clear hierarchy and efficient workflows</li>
                  <li>• Focus on internal operations</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section>
          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Links</h2>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/design-patterns/client" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
              >
                Client Portal Patterns
              </Link>
              <Link 
                href="/design-patterns/admin" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors"
              >
                Admin Portal Patterns
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 SkillBridge Platform. Design System v2.0</p>
          </div>
        </div>
      </footer>
    </div>
  )
}