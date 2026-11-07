import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, Play } from 'lucide-react';

interface TestScriptsProps {
  searchQuery: string;
}

const testScripts = [
  {
    id: 'google-search-selenium',
    app: 'Google Search',
    framework: 'Selenium (Java)',
    title: 'Automated Search Test',
    description: 'Selenium script to test Google search functionality',
    language: 'java',
    code: `import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

public class GoogleSearchTest {
    WebDriver driver;

    @BeforeTest
    public void setup() {
        System.setProperty("webdriver.chrome.driver", "path/to/chromedriver");
        driver = new ChromeDriver();
        driver.manage().window().maximize();
    }

    @Test
    public void testGoogleSearch() {
        // Navigate to Google
        driver.get("https://www.google.com");
        
        // Find search box and enter query
        WebElement searchBox = driver.findElement(By.name("q"));
        searchBox.sendKeys("Selenium WebDriver");
        searchBox.submit();
        
        // Wait and verify results page title
        String pageTitle = driver.getTitle();
        Assert.assertTrue(pageTitle.contains("Selenium WebDriver"));
        
        // Verify search results are displayed
        WebElement results = driver.findElement(By.id("search"));
        Assert.assertTrue(results.isDisplayed());
    }

    @AfterTest
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}`
  },
  {
    id: 'amazon-playwright',
    app: 'Amazon',
    framework: 'Playwright (TypeScript)',
    title: 'Product Search and Add to Cart',
    description: 'E2E test for searching products and adding to cart',
    language: 'typescript',
    code: `import { test, expect } from '@playwright/test';

test.describe('Amazon Product Search', () => {
  test('Search for product and add to cart', async ({ page }) => {
    // Navigate to Amazon
    await page.goto('https://www.amazon.com');
    
    // Search for product
    await page.fill('input[id="twotabsearchtextbox"]', 'laptop');
    await page.click('input[id="nav-search-submit-button"]');
    
    // Wait for search results
    await page.waitForSelector('.s-result-item');
    
    // Verify search results are displayed
    const results = await page.locator('.s-result-item').count();
    expect(results).toBeGreaterThan(0);
    
    // Click first product
    await page.locator('.s-result-item').first().click();
    
    // Wait for product page
    await page.waitForLoadState('networkidle');
    
    // Add to cart (handle different layouts)
    const addToCartButton = page.locator('#add-to-cart-button');
    if (await addToCartButton.isVisible()) {
      await addToCartButton.click();
      
      // Verify added to cart confirmation
      await expect(page.locator('#NATC_SMART_WAGON_CONF_MSG_SUCCESS')).toBeVisible();
    }
  });

  test('Filter products by price range', async ({ page }) => {
    await page.goto('https://www.amazon.com');
    
    // Search for electronics
    await page.fill('input[id="twotabsearchtextbox"]', 'headphones');
    await page.click('input[id="nav-search-submit-button"]');
    
    // Apply price filter
    await page.click('text=Under $25');
    
    // Wait for filtered results
    await page.waitForTimeout(2000);
    
    // Verify URL contains filter parameters
    expect(page.url()).toContain('rh=');
  });
});`
  },
  {
    id: 'login-cypress',
    app: 'Generic Login',
    framework: 'Cypress (JavaScript)',
    title: 'Login Authentication Test',
    description: 'Test login functionality with valid and invalid credentials',
    language: 'javascript',
    code: `describe('Login Tests', () => {
  beforeEach(() => {
    cy.visit('https://example.com/login');
  });

  it('should login successfully with valid credentials', () => {
    // Enter username
    cy.get('input[name="username"]').type('testuser@example.com');
    
    // Enter password
    cy.get('input[name="password"]').type('SecurePassword123');
    
    // Click login button
    cy.get('button[type="submit"]').click();
    
    // Verify redirect to dashboard
    cy.url().should('include', '/dashboard');
    
    // Verify user is logged in
    cy.get('.user-profile').should('be.visible');
    cy.contains('Welcome back').should('be.visible');
  });

  it('should show error with invalid credentials', () => {
    // Enter invalid credentials
    cy.get('input[name="username"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    
    // Click login button
    cy.get('button[type="submit"]').click();
    
    // Verify error message
    cy.get('.error-message')
      .should('be.visible')
      .and('contain', 'Invalid username or password');
    
    // Verify still on login page
    cy.url().should('include', '/login');
  });

  it('should validate required fields', () => {
    // Click login without entering credentials
    cy.get('button[type="submit"]').click();
    
    // Verify validation messages
    cy.get('input[name="username"]:invalid').should('exist');
    cy.get('input[name="password"]:invalid').should('exist');
  });

  it('should toggle password visibility', () => {
    const password = 'MySecretPassword';
    
    // Type password
    cy.get('input[name="password"]').type(password);
    
    // Password should be hidden
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
    
    // Click show password toggle
    cy.get('.toggle-password').click();
    
    // Password should be visible
    cy.get('input[name="password"]').should('have.attr', 'type', 'text');
    cy.get('input[name="password"]').should('have.value', password);
  });
});`
  },
  {
    id: 'api-rest-assured',
    app: 'REST API',
    framework: 'REST Assured (Java)',
    title: 'API CRUD Operations',
    description: 'Test REST API endpoints for user management',
    language: 'java',
    code: `import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class UserAPITest {
    
    @BeforeClass
    public void setup() {
        RestAssured.baseURI = "https://api.example.com";
        RestAssured.basePath = "/v1";
    }

    @Test
    public void testGetAllUsers() {
        given()
            .header("Content-Type", "application/json")
        .when()
            .get("/users")
        .then()
            .statusCode(200)
            .body("size()", greaterThan(0))
            .body("[0].id", notNullValue())
            .body("[0].name", notNullValue());
    }

    @Test
    public void testCreateUser() {
        String requestBody = "{"
            + "\\"name\\": \\"John Doe\\","
            + "\\"email\\": \\"john.doe@example.com\\","
            + "\\"age\\": 30"
            + "}";

        Response response = given()
            .header("Content-Type", "application/json")
            .body(requestBody)
        .when()
            .post("/users")
        .then()
            .statusCode(201)
            .body("name", equalTo("John Doe"))
            .body("email", equalTo("john.doe@example.com"))
            .body("id", notNullValue())
            .extract().response();

        // Store user ID for later tests
        String userId = response.path("id").toString();
        System.out.println("Created user ID: " + userId);
    }

    @Test
    public void testGetUserById() {
        String userId = "123";
        
        given()
            .header("Content-Type", "application/json")
            .pathParam("id", userId)
        .when()
            .get("/users/{id}")
        .then()
            .statusCode(200)
            .body("id", equalTo(userId))
            .body("name", notNullValue());
    }

    @Test
    public void testUpdateUser() {
        String userId = "123";
        String updateBody = "{"
            + "\\"name\\": \\"Jane Doe\\","
            + "\\"email\\": \\"jane.doe@example.com\\""
            + "}";

        given()
            .header("Content-Type", "application/json")
            .pathParam("id", userId)
            .body(updateBody)
        .when()
            .put("/users/{id}")
        .then()
            .statusCode(200)
            .body("name", equalTo("Jane Doe"))
            .body("email", equalTo("jane.doe@example.com"));
    }

    @Test
    public void testDeleteUser() {
        String userId = "123";
        
        given()
            .header("Content-Type", "application/json")
            .pathParam("id", userId)
        .when()
            .delete("/users/{id}")
        .then()
            .statusCode(204);

        // Verify user is deleted
        given()
            .pathParam("id", userId)
        .when()
            .get("/users/{id}")
        .then()
            .statusCode(404);
    }

    @Test
    public void testAPIResponseTime() {
        given()
            .header("Content-Type", "application/json")
        .when()
            .get("/users")
        .then()
            .time(lessThan(2000L)); // Response time < 2 seconds
    }
}`
  },
  {
    id: 'mobile-appium',
    app: 'Mobile App',
    framework: 'Appium (Python)',
    title: 'Mobile Login Test',
    description: 'Appium script for testing mobile app login',
    language: 'python',
    code: `from appium import webdriver
from appium.webdriver.common.mobileby import MobileBy
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest

class MobileLoginTest(unittest.TestCase):
    
    def setUp(self):
        desired_caps = {
            'platformName': 'Android',
            'platformVersion': '12',
            'deviceName': 'Android Emulator',
            'appPackage': 'com.example.app',
            'appActivity': '.MainActivity',
            'automationName': 'UiAutomator2'
        }
        
        self.driver = webdriver.Remote(
            'http://localhost:4723/wd/hub',
            desired_caps
        )
        self.wait = WebDriverWait(self.driver, 10)
    
    def test_successful_login(self):
        # Wait for username field
        username_field = self.wait.until(
            EC.presence_of_element_located(
                (MobileBy.ID, 'com.example.app:id/username')
            )
        )
        username_field.send_keys('testuser@example.com')
        
        # Enter password
        password_field = self.driver.find_element(
            MobileBy.ID, 'com.example.app:id/password'
        )
        password_field.send_keys('SecurePass123')
        
        # Click login button
        login_button = self.driver.find_element(
            MobileBy.ID, 'com.example.app:id/loginButton'
        )
        login_button.click()
        
        # Verify successful login
        dashboard = self.wait.until(
            EC.presence_of_element_located(
                (MobileBy.ID, 'com.example.app:id/dashboard')
            )
        )
        self.assertTrue(dashboard.is_displayed())
    
    def test_invalid_login(self):
        # Enter invalid credentials
        username_field = self.wait.until(
            EC.presence_of_element_located(
                (MobileBy.ID, 'com.example.app:id/username')
            )
        )
        username_field.send_keys('invalid@example.com')
        
        password_field = self.driver.find_element(
            MobileBy.ID, 'com.example.app:id/password'
        )
        password_field.send_keys('wrongpassword')
        
        # Click login button
        login_button = self.driver.find_element(
            MobileBy.ID, 'com.example.app:id/loginButton'
        )
        login_button.click()
        
        # Verify error message
        error_message = self.wait.until(
            EC.presence_of_element_located(
                (MobileBy.ID, 'com.example.app:id/errorMessage')
            )
        )
        self.assertIn('Invalid credentials', error_message.text)
    
    def tearDown(self):
        if self.driver:
            self.driver.quit()

if __name__ == '__main__':
    unittest.main()`
  }
];

export function TestScripts({ searchQuery }: TestScriptsProps) {
  const [expandedScript, setExpandedScript] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const filteredScripts = testScripts.filter(script =>
    searchQuery === '' ||
    script.app.toLowerCase().includes(searchQuery.toLowerCase()) ||
    script.framework.toLowerCase().includes(searchQuery.toLowerCase()) ||
    script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    script.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Test Scripts</h3>
        <p className="text-slate-600">Ready-to-use automation scripts for various frameworks and applications</p>
      </div>

      <p className="text-slate-600 mb-6">
        {filteredScripts.length} test script{filteredScripts.length !== 1 ? 's' : ''} available
      </p>

      <div className="space-y-4">
        {filteredScripts.map(script => (
          <div key={script.id} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            <button
              onClick={() => setExpandedScript(expandedScript === script.id ? null : script.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-slate-900">{script.title}</h3>
                  <p className="text-slate-600 text-sm">{script.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {script.app}
                    </span>
                    <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                      {script.framework}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {expandedScript === script.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(script.code, script.id);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                  >
                    {copiedId === script.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                )}
                {expandedScript === script.id ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </button>

            {expandedScript === script.id && (
              <div className="px-6 pb-6">
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-slate-100 whitespace-pre">
                    <code>{script.code}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredScripts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No test scripts found. Try adjusting your search.</p>
        </div>
      )}

      <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">
        <div className="flex items-start gap-3">
          <Play className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h3 className="text-green-900 mb-2">Run These Scripts</h3>
            <p className="text-green-700 text-sm">
              Make sure to update configuration values like URLs, credentials, and element locators to match your environment before running these scripts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}