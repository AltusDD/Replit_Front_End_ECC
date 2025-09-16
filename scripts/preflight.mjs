import { execSync } from 'child_process';

console.log("🛡️  Running ECC MEGA LOCKDOWN preflight checks...");

try {
  // Run mega guardrail
  console.log("Running mega guardrail...");
  execSync("node scripts/guardrail-mega.mjs", { stdio: 'inherit' });
  
  // Run overlay guardrail  
  console.log("Running overlay guardrail...");
  execSync("node scripts/guardrail-overlays.mjs", { stdio: 'inherit' });
  
  // Run existing guardrail
  console.log("Running existing guardrail...");
  execSync("node scripts/guardrail-check.mjs", { stdio: 'inherit' });
  
  console.log("✅ All preflight checks passed!");
} catch (error) {
  console.error("❌ Preflight checks failed!");
  process.exit(error.status || 1);
}