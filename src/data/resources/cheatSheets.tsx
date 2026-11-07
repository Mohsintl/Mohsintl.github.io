import { Code2, Target, Zap, Shield, Database, Globe } from 'lucide-react';

export interface CheatSheet {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  icon: React.ReactNode;
  color: string;
  sections: {
    title: string;
    items: {
      code?: string;
      description?: string;
    }[];
  }[];
  resources?: {
    label: string;
    url: string;
  }[];
}

export const cheatSheets: CheatSheet[] = [
  {
    id: 'selenium-basics',
    title: 'Selenium WebDriver',
    description: 'Essential Selenium commands and best practices',
    category: 'automation',
    tags: ['Selenium', 'WebDriver', 'Java', 'Python'],
    icon: <Code2 className="w-5 h-5 text-white" />,
    color: 'bg-gradient-to-br from-green-500 to-emerald-600',
    sections: [
      {
        title: 'Setup & Initialization',
        items: [
          { code: 'WebDriver driver = new ChromeDriver();', description: 'Initialize Chrome driver' },
          { code: 'driver.get("https://example.com");', description: 'Navigate to URL' },
          { code: 'driver.quit();', description: 'Close browser and end session' },
        ],
      },
      {
        title: 'Element Locators',
        items: [
          { code: 'driver.findElement(By.id("username"));', description: 'Find by ID' },
          { code: 'driver.findElement(By.className("btn"));', description: 'Find by class name' },
          { code: 'driver.findElement(By.xpath("//button[@type=\'submit\']"));', description: 'Find by XPath' },
          { code: 'driver.findElement(By.cssSelector(".login-btn"));', description: 'Find by CSS selector' },
        ],
      },
      {
        title: 'Common Actions',
        items: [
          { code: 'element.click();', description: 'Click an element' },
          { code: 'element.sendKeys("text");', description: 'Type into input field' },
          { code: 'element.clear();', description: 'Clear input field' },
          { code: 'element.getText();', description: 'Get element text' },
        ],
      },
    ],
    resources: [
      { label: 'Official Docs', url: 'https://www.selenium.dev/documentation/' },
    ],
  },
  {
    id: 'playwright-essentials',
    title: 'Playwright',
    description: 'Modern browser automation with Playwright',
    category: 'automation',
    tags: ['Playwright', 'TypeScript', 'JavaScript', 'E2E'],
    icon: <Globe className="w-5 h-5 text-white" />,
    color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    sections: [
      {
        title: 'Basic Setup',
        items: [
          { code: 'const { chromium } = require(\'playwright\');', description: 'Import Playwright' },
          { code: 'const browser = await chromium.launch();', description: 'Launch browser' },
          { code: 'const page = await browser.newPage();', description: 'Create new page' },
          { code: 'await page.goto(\'https://example.com\');', description: 'Navigate to URL' },
        ],
      },
      {
        title: 'Interactions',
        items: [
          { code: 'await page.click(\'button\');', description: 'Click element' },
          { code: 'await page.fill(\'input\', \'text\');', description: 'Fill input field' },
          { code: 'await page.selectOption(\'select\', \'value\');', description: 'Select dropdown option' },
          { code: 'const text = await page.textContent(\'.class\');', description: 'Get text content' },
        ],
      },
      {
        title: 'Assertions',
        items: [
          { code: 'await expect(page).toHaveTitle(\'Title\');', description: 'Assert page title' },
          { code: 'await expect(page.locator(\'.btn\')).toBeVisible();', description: 'Assert element visible' },
          { code: 'await expect(page).toHaveURL(/.*checkout/);', description: 'Assert URL pattern' },
        ],
      },
    ],
    resources: [
      { label: 'Playwright Docs', url: 'https://playwright.dev/' },
    ],
  },
  {
    id: 'test-strategy',
    title: 'Test Strategy Essentials',
    description: 'Building effective QA strategies',
    category: 'strategy',
    tags: ['Strategy', 'Planning', 'Best Practices'],
    icon: <Target className="w-5 h-5 text-white" />,
    color: 'bg-gradient-to-br from-purple-500 to-pink-600',
    sections: [
      {
        title: 'Test Pyramid Levels',
        items: [
          { description: 'Unit Tests (70%): Fast, isolated component tests' },
          { description: 'Integration Tests (20%): Test component interactions' },
          { description: 'E2E Tests (10%): Full user journey validation' },
        ],
      },
      {
        title: 'Key Principles',
        items: [
          { description: 'Test early and test often in the development cycle' },
          { description: 'Automate repetitive and regression tests' },
          { description: 'Prioritize tests based on risk and business impact' },
          { description: 'Maintain test independence and isolation' },
        ],
      },
      {
        title: 'Coverage Goals',
        items: [
          { description: 'Happy path scenarios for all critical features' },
          { description: 'Boundary value and edge case testing' },
          { description: 'Error handling and negative scenarios' },
          { description: 'Cross-browser and cross-device testing' },
        ],
      },
    ],
  },
  {
    id: 'api-testing',
    title: 'API Testing with REST Assured',
    description: 'REST API testing fundamentals',
    category: 'api',
    tags: ['API', 'REST', 'Java', 'HTTP'],
    icon: <Database className="w-5 h-5 text-white" />,
    color: 'bg-gradient-to-br from-orange-500 to-red-600',
    sections: [
      {
        title: 'Basic Requests',
        items: [
          { code: 'given().when().get("/users").then().statusCode(200);', description: 'GET request' },
          { code: 'given().body(user).when().post("/users");', description: 'POST with body' },
          { code: 'given().when().put("/users/1").then();', description: 'PUT request' },
          { code: 'given().when().delete("/users/1");', description: 'DELETE request' },
        ],
      },
      {
        title: 'Validations',
        items: [
          { code: '.then().statusCode(200)', description: 'Validate status code' },
          { code: '.then().body("name", equalTo("John"))', description: 'Validate response body' },
          { code: '.then().header("Content-Type", "application/json")', description: 'Validate headers' },
          { code: '.then().time(lessThan(2000L))', description: 'Validate response time' },
        ],
      },
      {
        title: 'Authentication',
        items: [
          { code: 'given().auth().basic("user", "pass")', description: 'Basic auth' },
          { code: 'given().header("Authorization", "Bearer " + token)', description: 'Bearer token' },
          { code: 'given().auth().oauth2(accessToken)', description: 'OAuth 2.0' },
        ],
      },
    ],
    resources: [
      { label: 'REST Assured', url: 'https://rest-assured.io/' },
    ],
  },
  {
    id: 'cypress-basics',
    title: 'Cypress Essentials',
    description: 'Fast, reliable E2E testing with Cypress',
    category: 'automation',
    tags: ['Cypress', 'JavaScript', 'E2E', 'Testing'],
    icon: <Zap className="w-5 h-5 text-white" />,
    color: 'bg-gradient-to-br from-teal-500 to-cyan-600',
    sections: [
      {
        title: 'Basic Commands',
        items: [
          { code: 'cy.visit(\'/login\')', description: 'Navigate to page' },
          { code: 'cy.get(\'.btn\').click()', description: 'Click element' },
          { code: 'cy.get(\'input\').type(\'text\')', description: 'Type into input' },
          { code: 'cy.contains(\'Submit\').click()', description: 'Find by text and click' },
        ],
      },
      {
        title: 'Assertions',
        items: [
          { code: 'cy.get(\'.title\').should(\'be.visible\')', description: 'Assert visibility' },
          { code: 'cy.get(\'.error\').should(\'contain\', \'Invalid\')', description: 'Assert text content' },
          { code: 'cy.url().should(\'include\', \'/dashboard\')', description: 'Assert URL' },
          { code: 'cy.get(\'input\').should(\'have.value\', \'test\')', description: 'Assert input value' },
        ],
      },
      {
        title: 'Best Practices',
        items: [
          { description: 'Use data-* attributes for test selectors' },
          { description: 'Avoid using cy.wait() with hardcoded times' },
          { description: 'Keep tests independent and isolated' },
          { description: 'Use fixtures for test data management' },
        ],
      },
    ],
    resources: [
      { label: 'Cypress Docs', url: 'https://docs.cypress.io/' },
    ],
  },
  {
    id: 'performance-testing',
    title: 'Performance Testing',
    description: 'Load testing and performance metrics',
    category: 'performance',
    tags: ['Performance', 'JMeter', 'Load Testing'],
    icon: <Zap className="w-5 h-5 text-white" />,
    color: 'bg-gradient-to-br from-yellow-500 to-orange-600',
    sections: [
      {
        title: 'Key Metrics',
        items: [
          { description: 'Response Time: Time to receive first/last byte' },
          { description: 'Throughput: Requests per second (RPS)' },
          { description: 'Error Rate: Percentage of failed requests' },
          { description: 'Concurrent Users: Number of simultaneous users' },
        ],
      },
      {
        title: 'Testing Types',
        items: [
          { description: 'Load Test: Verify system under expected load' },
          { description: 'Stress Test: Find breaking point of system' },
          { description: 'Spike Test: Test sudden traffic increases' },
          { description: 'Soak Test: Sustained load over extended period' },
        ],
      },
      {
        title: 'Best Practices',
        items: [
          { description: 'Test in production-like environment' },
          { description: 'Start with baseline performance metrics' },
          { description: 'Monitor server resources (CPU, memory, disk)' },
          { description: 'Test individual components before full system' },
        ],
      },
    ],
  },
  {
    id: 'security-testing',
    title: 'Security Testing Basics',
    description: 'Essential security testing techniques',
    category: 'security',
    tags: ['Security', 'OWASP', 'Penetration Testing'],
    icon: <Shield className="w-5 h-5 text-white" />,
    color: 'bg-gradient-to-br from-red-500 to-rose-600',
    sections: [
      {
        title: 'OWASP Top 10',
        items: [
          { description: 'Injection: SQL, NoSQL, OS command injection' },
          { description: 'Broken Authentication: Session management flaws' },
          { description: 'Sensitive Data Exposure: Unencrypted data' },
          { description: 'XSS: Cross-site scripting attacks' },
          { description: 'Broken Access Control: Unauthorized access' },
        ],
      },
      {
        title: 'Common Checks',
        items: [
          { description: 'Test authentication and authorization mechanisms' },
          { description: 'Validate input sanitization and output encoding' },
          { description: 'Check for secure communication (HTTPS, TLS)' },
          { description: 'Verify session management and timeout' },
        ],
      },
      {
        title: 'Tools',
        items: [
          { description: 'OWASP ZAP: Web application security scanner' },
          { description: 'Burp Suite: Web vulnerability scanner' },
          { description: 'Nmap: Network discovery and security auditing' },
          { description: 'Metasploit: Penetration testing framework' },
        ],
      },
    ],
    resources: [
      { label: 'OWASP', url: 'https://owasp.org/' },
    ],
  },
  {
    id: 'postman-api',
    title: 'Postman API Testing',
    description: 'API testing and automation with Postman',
    category: 'api',
    tags: ['Postman', 'API', 'REST', 'Testing'],
    icon: <Database className="w-5 h-5 text-white" />,
    color: 'bg-gradient-to-br from-amber-500 to-orange-600',
    sections: [
      {
        title: 'Test Scripts',
        items: [
          { code: 'pm.test("Status is 200", () => { pm.response.to.have.status(200); });', description: 'Status code test' },
          { code: 'pm.test("Response has name", () => { pm.expect(pm.response.json().name).to.exist; });', description: 'JSON validation' },
          { code: 'pm.environment.set("token", pm.response.json().token);', description: 'Set environment variable' },
        ],
      },
      {
        title: 'Common Assertions',
        items: [
          { code: 'pm.response.to.have.status(200)', description: 'Assert status code' },
          { code: 'pm.response.to.have.header("Content-Type")', description: 'Assert header exists' },
          { code: 'pm.expect(jsonData.value).to.eql("expected")', description: 'Assert value equals' },
          { code: 'pm.response.to.have.jsonBody("key")', description: 'Assert JSON key exists' },
        ],
      },
      {
        title: 'Variables',
        items: [
          { code: '{{variable}}', description: 'Use variable in request' },
          { code: 'pm.globals.set("key", "value")', description: 'Set global variable' },
          { code: 'pm.environment.get("key")', description: 'Get environment variable' },
        ],
      },
    ],
  },
  {
    id: 'test-design',
    title: 'Test Design Techniques',
    description: 'Effective test case design methods',
    category: 'strategy',
    tags: ['Test Design', 'Techniques', 'QA'],
    icon: <Target className="w-5 h-5 text-white" />,
    color: 'bg-gradient-to-br from-indigo-500 to-blue-600',
    sections: [
      {
        title: 'Black Box Techniques',
        items: [
          { description: 'Equivalence Partitioning: Divide inputs into valid/invalid classes' },
          { description: 'Boundary Value Analysis: Test at boundaries of input ranges' },
          { description: 'Decision Table Testing: Test combinations of conditions' },
          { description: 'State Transition Testing: Test state changes and transitions' },
        ],
      },
      {
        title: 'White Box Techniques',
        items: [
          { description: 'Statement Coverage: Execute all code statements' },
          { description: 'Branch Coverage: Test all decision branches' },
          { description: 'Path Coverage: Test all possible paths through code' },
          { description: 'Condition Coverage: Test all boolean conditions' },
        ],
      },
      {
        title: 'Experience-Based',
        items: [
          { description: 'Error Guessing: Predict errors based on experience' },
          { description: 'Exploratory Testing: Simultaneous learning and testing' },
          { description: 'Checklist-Based: Use predefined checklists' },
        ],
      },
    ],
  },
];
