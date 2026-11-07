import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';

interface TestCasesProps {
  searchQuery: string;
}

const testCases = [
  {
    id: 'google-search',
    app: 'Google Search',
    category: 'Search Engine',
    cases: [
      {
        id: 'TC001',
        title: 'Basic Search Functionality',
        priority: 'High',
        steps: [
          'Navigate to google.com',
          'Enter search query "software testing"',
          'Click Search button or press Enter',
        ],
        expected: 'Search results page displays with relevant results for "software testing"',
        preconditions: 'User has internet connection and browser open'
      },
      {
        id: 'TC002',
        title: 'Search Autocomplete',
        priority: 'Medium',
        steps: [
          'Navigate to google.com',
          'Start typing "java" in search box',
          'Observe dropdown suggestions',
        ],
        expected: 'Autocomplete suggestions appear showing popular searches starting with "java"',
        preconditions: 'JavaScript enabled in browser'
      },
      {
        id: 'TC003',
        title: 'Image Search',
        priority: 'Medium',
        steps: [
          'Navigate to google.com',
          'Click on "Images" tab',
          'Enter search query "sunset"',
          'Press Enter',
        ],
        expected: 'Grid of sunset images is displayed with thumbnails',
        preconditions: 'None'
      }
    ]
  },
  {
    id: 'amazon-ecommerce',
    app: 'Amazon',
    category: 'E-commerce',
    cases: [
      {
        id: 'TC001',
        title: 'Product Search',
        priority: 'Critical',
        steps: [
          'Navigate to amazon.com',
          'Enter "laptop" in search bar',
          'Click search icon or press Enter',
        ],
        expected: 'List of laptop products displayed with images, prices, and ratings',
        preconditions: 'User on Amazon homepage'
      },
      {
        id: 'TC002',
        title: 'Add to Cart',
        priority: 'Critical',
        steps: [
          'Search for a product',
          'Click on product from results',
          'Click "Add to Cart" button',
          'Verify cart icon updates',
        ],
        expected: 'Product is added to cart, cart count increases by 1, confirmation message shown',
        preconditions: 'Product is in stock and available'
      },
      {
        id: 'TC003',
        title: 'Filter by Price Range',
        priority: 'High',
        steps: [
          'Navigate to any product category',
          'Locate price filter in sidebar',
          'Select price range (e.g., $100-$200)',
          'Apply filter',
        ],
        expected: 'Products displayed are within selected price range',
        preconditions: 'Category page with multiple products at various prices'
      },
      {
        id: 'TC004',
        title: 'Checkout Process',
        priority: 'Critical',
        steps: [
          'Add item to cart',
          'Click cart icon',
          'Click "Proceed to Checkout"',
          'Enter shipping information',
          'Select shipping method',
          'Enter payment information',
        ],
        expected: 'User successfully completes checkout flow without errors',
        preconditions: 'User is logged in, has valid payment method'
      }
    ]
  },
  {
    id: 'gmail',
    app: 'Gmail',
    category: 'Email',
    cases: [
      {
        id: 'TC001',
        title: 'Compose and Send Email',
        priority: 'Critical',
        steps: [
          'Login to Gmail',
          'Click "Compose" button',
          'Enter recipient email',
          'Enter subject line',
          'Type message body',
          'Click "Send" button',
        ],
        expected: 'Email is sent successfully, appears in Sent folder, confirmation message shown',
        preconditions: 'User is logged in with valid credentials'
      },
      {
        id: 'TC002',
        title: 'Search Emails',
        priority: 'High',
        steps: [
          'Login to Gmail',
          'Click search bar at top',
          'Enter search query (e.g., sender name or keyword)',
          'Press Enter',
        ],
        expected: 'Matching emails are displayed in search results',
        preconditions: 'User has emails in inbox'
      },
      {
        id: 'TC003',
        title: 'Attach File to Email',
        priority: 'High',
        steps: [
          'Click "Compose"',
          'Click attachment icon',
          'Select file from computer',
          'Wait for upload to complete',
          'Verify file appears in email',
        ],
        expected: 'File is attached successfully and shows in compose window with file name and size',
        preconditions: 'File size is under attachment limit (25MB for Gmail)'
      }
    ]
  },
  {
    id: 'netflix',
    app: 'Netflix',
    category: 'Streaming',
    cases: [
      {
        id: 'TC001',
        title: 'Video Playback',
        priority: 'Critical',
        steps: [
          'Login to Netflix',
          'Select a movie or show',
          'Click Play button',
          'Observe video playback',
        ],
        expected: 'Video plays smoothly without buffering, audio syncs with video',
        preconditions: 'User has active subscription, stable internet connection'
      },
      {
        id: 'TC002',
        title: 'Search for Content',
        priority: 'High',
        steps: [
          'Login to Netflix',
          'Click search icon',
          'Enter title or keyword',
          'View search results',
        ],
        expected: 'Relevant movies and shows appear in search results',
        preconditions: 'User is logged in'
      },
      {
        id: 'TC003',
        title: 'Add to My List',
        priority: 'Medium',
        steps: [
          'Browse content',
          'Hover over a title',
          'Click "+" (Add to My List) icon',
          'Navigate to My List',
        ],
        expected: 'Title is added to My List and appears in the My List section',
        preconditions: 'User is logged in'
      }
    ]
  },
  {
    id: 'linkedin',
    app: 'LinkedIn',
    category: 'Social Network',
    cases: [
      {
        id: 'TC001',
        title: 'Create Post',
        priority: 'High',
        steps: [
          'Login to LinkedIn',
          'Click "Start a post"',
          'Enter post content',
          'Click "Post" button',
        ],
        expected: 'Post is published and appears on user feed',
        preconditions: 'User is logged in'
      },
      {
        id: 'TC002',
        title: 'Send Connection Request',
        priority: 'High',
        steps: [
          'Search for a user',
          'Click on their profile',
          'Click "Connect" button',
          'Add optional note',
          'Click "Send"',
        ],
        expected: 'Connection request is sent, button changes to "Pending"',
        preconditions: 'User is not already connected with the person'
      },
      {
        id: 'TC003',
        title: 'Job Search',
        priority: 'High',
        steps: [
          'Click "Jobs" in navigation',
          'Enter job title and location',
          'Click Search',
          'Apply filters (experience, company, etc.)',
        ],
        expected: 'Relevant job listings displayed matching search criteria and filters',
        preconditions: 'User is logged in'
      }
    ]
  }
];

export function TestCases({ searchQuery }: TestCasesProps) {
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [expandedCase, setExpandedCase] = useState<string | null>(null);
  const filteredTestCases = testCases.filter(app =>
    searchQuery === '' ||
    app.app.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.cases.some(tc => 
      tc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tc.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Test Cases</h3>
        <p className="text-slate-600">Real-world test cases for popular websites and applications</p>
      </div>

      <p className="text-slate-600 mb-6">
        {filteredTestCases.length} application{filteredTestCases.length !== 1 ? 's' : ''} with test cases
      </p>

      <div className="space-y-4">
        {filteredTestCases.map(app => (
          <div key={app.id} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            <button
              onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-left">
                  <h3 className="text-slate-900">{app.app}</h3>
                  <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs mt-1">
                    {app.category}
                  </span>
                  <p className="text-slate-600 text-sm mt-1">{app.cases.length} test cases</p>
                </div>
              </div>
              {expandedApp === app.id ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {expandedApp === app.id && (
              <div className="px-6 pb-6 space-y-3">
                {app.cases.map(testCase => (
                  <div key={testCase.id} className="border border-slate-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedCase(expandedCase === testCase.id ? null : testCase.id)}
                      className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs font-mono">
                          {testCase.id}
                        </span>
                        <span className="text-slate-900">{testCase.title}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          testCase.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                          testCase.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {testCase.priority}
                        </span>
                      </div>
                      {expandedCase === testCase.id ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    {expandedCase === testCase.id && (
                      <div className="p-4 bg-white space-y-3">
                        <div>
                          <h4 className="text-slate-900 mb-2">Preconditions</h4>
                          <p className="text-slate-600 text-sm">{testCase.preconditions}</p>
                        </div>
                        <div>
                          <h4 className="text-slate-900 mb-2">Steps to Execute</h4>
                          <ol className="list-decimal list-inside space-y-1">
                            {testCase.steps.map((step, idx) => (
                              <li key={idx} className="text-slate-600 text-sm">{step}</li>
                            ))}
                          </ol>
                        </div>
                        <div>
                          <h4 className="text-slate-900 mb-2">Expected Result</h4>
                          <p className="text-slate-600 text-sm">{testCase.expected}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTestCases.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No test cases found. Try adjusting your search.</p>
        </div>
      )}

      <div className="mt-8 p-6 bg-indigo-50 border border-indigo-200 rounded-xl">
        <div className="flex items-start gap-3">
          <Plus className="w-5 h-5 text-indigo-600 mt-0.5" />
          <div>
            <h3 className="text-indigo-900 mb-2">Contribute Test Cases</h3>
            <p className="text-indigo-700 text-sm">
              Have test cases for other popular applications? Contribute to the community by submitting your test cases via GitHub.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}