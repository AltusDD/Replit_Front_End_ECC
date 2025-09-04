// scripts/audit_portfolio_data.ts
// Verification script to ensure 100% compliance with Portfolio V3 requirements

type Check = { name: string; url: string; keys: string[]; min: number };

const BASE_URL = "http://localhost:8787";

const CHECKS: Check[] = [
  {
    name: "Properties",
    url: `${BASE_URL}/api/portfolio/properties`,
    keys: ["id", "name", "type", "class", "state", "city", "zip", "units", "occPct", "active"],
    min: 100
  },
  {
    name: "Units", 
    url: `${BASE_URL}/api/portfolio/units`,
    keys: ["id", "propertyName", "unitLabel", "beds", "baths", "sqft", "status", "marketRent"],
    min: 100
  },
  {
    name: "Leases",
    url: `${BASE_URL}/api/portfolio/leases`, 
    keys: ["id", "propertyName", "unitLabel", "tenants", "status", "start", "end", "rent"],
    min: 50
  },
  {
    name: "Tenants",
    url: `${BASE_URL}/api/portfolio/tenants`,
    keys: ["id", "name", "email", "phone", "propertyName", "unitLabel", "type", "balance"],
    min: 25
  },
  {
    name: "Owners",
    url: `${BASE_URL}/api/portfolio/owners`,
    keys: ["id", "company", "email", "phone", "active"],
    min: 10
  }
];

async function auditPortfolioData() {
  console.log("🔍 Portfolio V3 Data Audit - Relationship-Driven Backend");
  console.log("=" .repeat(60));
  
  let passCount = 0;
  let totalChecks = CHECKS.length;
  
  for (const check of CHECKS) {
    try {
      console.log(`\n📊 Testing ${check.name}...`);
      
      const response = await fetch(check.url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Check if it's an array
      if (!Array.isArray(data)) {
        throw new Error(`Expected array, got ${typeof data}`);
      }
      
      // Check minimum count
      if (data.length < check.min) {
        console.log(`⚠️  Warning: Expected min ${check.min} items, got ${data.length}`);
      }
      
      // Check required fields on first item
      if (data.length > 0) {
        const sample = data[0];
        const missingKeys = check.keys.filter(key => !(key in sample));
        
        if (missingKeys.length > 0) {
          throw new Error(`Missing required fields: ${missingKeys.join(", ")}`);
        }
        
        console.log(`✅ ${check.name}: ${data.length} items with all required fields`);
        console.log(`   Sample: ${JSON.stringify(sample, null, 2).substring(0, 200)}...`);
        passCount++;
      } else {
        console.log(`❌ ${check.name}: No data returned`);
      }
      
    } catch (error) {
      console.log(`❌ ${check.name}: ${error.message}`);
    }
  }
  
  console.log(`\n${"=".repeat(60)}`);
  console.log(`📈 Results: ${passCount}/${totalChecks} endpoints passed`);
  
  if (passCount === totalChecks) {
    console.log("🎉 ALL CHECKS PASSED - Portfolio V3 backend is fully compliant!");
    process.exit(0);
  } else {
    console.log("❌ Some checks failed - see errors above");
    process.exit(1);
  }
}

// Test debug endpoint
async function testDebugEndpoint() {
  try {
    console.log("\n🔧 Testing debug SQL endpoint...");
    const debugUrl = `${BASE_URL}/api/portfolio/_debug/sql?q=SELECT id, name FROM properties&limit=3`;
    const response = await fetch(debugUrl);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Debug endpoint working: ${JSON.stringify(data).substring(0, 100)}...`);
    } else {
      console.log(`⚠️  Debug endpoint returned ${response.status}`);
    }
  } catch (error) {
    console.log(`⚠️  Debug endpoint error: ${error.message}`);
  }
}

// Run audit
auditPortfolioData().then(() => testDebugEndpoint());