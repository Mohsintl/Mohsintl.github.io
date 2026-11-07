/** Manual test cases for well-known apps, grouped by app. */
export type TestCase = {
  id: string;
  title: string;
  priority: string;
  steps: string[];
  expected: string;
  preconditions: string;
};

export type AppTestCases = { id: string; app: string; category: string; cases: TestCase[] };

export const testCases: AppTestCases[] = [
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
