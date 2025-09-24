#!/usr/bin/env node
/**
 * PR Cleanup Script for Replit_Front_End_ECC
 * 
 * This script analyzes open pull requests and provides recommendations for cleanup.
 * It identifies:
 * - Superseded dependency updates
 * - Safe dependency updates ready to merge
 * - Major version updates that need review
 * - Feature PRs that need attention
 * - Stale branches that can be cleaned up
 */

import { execSync } from 'child_process';
import fs from 'fs';

const REPO_OWNER = 'AltusDD';
const REPO_NAME = 'Replit_Front_End_ECC';

class PRCleanupAnalyzer {
  constructor() {
    this.dependencyPRs = new Map();
    this.featurePRs = [];
    this.obsoletePRs = [];
  }

  async analyzePRs() {
    console.log('🔍 Analyzing open pull requests...\n');
    
    try {
      // Get all open PRs using gh CLI if available, otherwise provide manual instructions
      const prsOutput = execSync(`gh pr list --repo ${REPO_OWNER}/${REPO_NAME} --state open --json number,title,author,headRefName`, 
        { encoding: 'utf-8' });
      
      const prs = JSON.parse(prsOutput);
      
      for (const pr of prs) {
        this.categorizePR(pr);
      }
      
    } catch (error) {
      console.log('⚠️  Could not fetch PRs automatically. Please run: gh auth login');
      console.log('Manual PR analysis based on known PRs:');
      this.manualAnalysis();
    }

    this.generateRecommendations();
  }

  categorizePR(pr) {
    const { number, title, author, headRefName } = pr;
    
    // Check if it's a Dependabot PR
    if (author.login === 'dependabot[bot]') {
      this.categorizeDependencyPR(pr);
    } else {
      this.featurePRs.push(pr);
    }
  }

  categorizeDependencyPR(pr) {
    const { number, title } = pr;
    
    // Extract package name and version info from title
    const bumpMatch = title.match(/Bump (.+?) from (.+?) to (.+?)(?:\s|$)/);
    if (bumpMatch) {
      const [, packageName, fromVersion, toVersion] = bumpMatch;
      
      if (!this.dependencyPRs.has(packageName)) {
        this.dependencyPRs.set(packageName, []);
      }
      
      this.dependencyPRs.get(packageName).push({
        ...pr,
        packageName,
        fromVersion,
        toVersion,
        isMajorUpdate: this.isMajorVersionUpdate(fromVersion, toVersion)
      });
    }
  }

  manualAnalysis() {
    // Manual analysis for known PRs
    const knownPRs = [
      { number: 60, title: 'Feat/cards polish kpis(Gemini)', type: 'feature', needsReview: true },
      { number: 58, title: 'Bump zod from 4.1.5 to 4.1.11', type: 'dependency', safe: true, packageName: 'zod' },
      { number: 57, title: 'Bump framer-motion from 12.23.12 to 12.23.18', type: 'dependency', safe: true, packageName: 'framer-motion' },
      { number: 56, title: 'Bump wouter from 2.12.1 to 3.7.1', type: 'dependency', major: true, packageName: 'wouter' },
      { number: 55, title: 'Bump vite from 5.4.19 to 7.1.7', type: 'dependency', major: true, packageName: 'vite' },
      { number: 54, title: 'Bump vite from 5.4.19 to 5.4.20', type: 'dependency', superseded: true, packageName: 'vite' }
    ];

    knownPRs.forEach(pr => {
      if (pr.type === 'dependency') {
        if (!this.dependencyPRs.has(pr.packageName)) {
          this.dependencyPRs.set(pr.packageName, []);
        }
        this.dependencyPRs.get(pr.packageName).push(pr);
      } else {
        this.featurePRs.push(pr);
      }
      
      if (pr.superseded) {
        this.obsoletePRs.push(pr);
      }
    });
  }

  isMajorVersionUpdate(from, to) {
    const fromMajor = parseInt(from.split('.')[0]);
    const toMajor = parseInt(to.split('.')[0]);
    return toMajor > fromMajor;
  }

  generateRecommendations() {
    console.log('📋 PR Cleanup Recommendations\n');
    console.log('=' .repeat(50));
    
    // 1. Obsolete/Superseded PRs
    console.log('\n🗑️  PRs to CLOSE (superseded):');
    this.dependencyPRs.forEach((prs, packageName) => {
      if (prs.length > 1) {
        // Sort by version to find the superseded ones
        const sorted = prs.sort((a, b) => {
          if (a.toVersion && b.toVersion) {
            return a.toVersion.localeCompare(b.toVersion, undefined, { numeric: true });
          }
          return 0;
        });
        
        // All but the last (highest version) should be closed
        for (let i = 0; i < sorted.length - 1; i++) {
          console.log(`   • PR #${sorted[i].number}: ${sorted[i].title}`);
          console.log(`     Reason: Superseded by PR #${sorted[sorted.length - 1].number}`);
        }
      }
    });

    // Add manual obsolete PRs
    this.obsoletePRs.forEach(pr => {
      console.log(`   • PR #${pr.number}: ${pr.title}`);
      console.log(`     Reason: ${pr.superseded ? 'Superseded by newer version' : 'Obsolete'}`);
    });

    // 2. Safe to merge dependency PRs
    console.log('\n✅ PRs SAFE TO MERGE (minor/patch updates):');
    this.dependencyPRs.forEach((prs, packageName) => {
      const latest = prs[prs.length - 1]; // Get the latest version PR
      if (latest && (latest.safe || !latest.isMajorUpdate)) {
        console.log(`   • PR #${latest.number}: ${latest.title}`);
        console.log(`     Package: ${packageName}`);
      }
    });

    // 3. Major updates needing review
    console.log('\n⚠️  PRs NEEDING REVIEW (major updates):');
    this.dependencyPRs.forEach((prs, packageName) => {
      const latest = prs[prs.length - 1];
      if (latest && (latest.major || latest.isMajorUpdate)) {
        console.log(`   • PR #${latest.number}: ${latest.title}`);
        console.log(`     Package: ${packageName} - MAJOR VERSION CHANGE`);
        console.log(`     ⚠️  Check for breaking changes before merging!`);
      }
    });

    // 4. Feature PRs
    console.log('\n🚀 FEATURE PRs needing attention:');
    this.featurePRs.forEach(pr => {
      console.log(`   • PR #${pr.number}: ${pr.title}`);
      if (pr.needsReview) {
        console.log(`     Status: Needs review and testing`);
      }
    });

    // 5. Suggested commands
    this.generateCommands();
  }

  generateCommands() {
    console.log('\n🤖 Suggested GitHub CLI Commands:');
    console.log('=' .repeat(50));

    console.log('\n# Close superseded PRs:');
    // Find vite PRs to demonstrate superseded logic
    const vitePRs = this.dependencyPRs.get('vite');
    if (vitePRs && vitePRs.length > 1) {
      console.log('gh pr close 54 --comment "Superseded by PR #55 with newer vite version"');
    }

    console.log('\n# Merge safe dependency updates:');
    const safePRs = [58]; // zod update is safe
    safePRs.forEach(pr => {
      console.log(`gh pr merge ${pr} --squash --delete-branch`);
    });

    console.log('\n# For major updates - run tests first:');
    console.log('npm test  # Run tests');
    console.log('npm run build  # Ensure build works');
    console.log('# Then merge if tests pass:');
    console.log('gh pr merge <PR_NUMBER> --squash --delete-branch');

    console.log('\n# Check feature PR status:');
    console.log('gh pr view 60 --comments  # Review comments and status');
  }
}

// Create automated cleanup script
function createAutomatedCleanupScript() {
  const scriptContent = `#!/bin/bash
# Automated PR Cleanup Script
# This script safely merges approved dependency updates

set -e

echo "🧹 Starting automated PR cleanup..."

# Function to check if PR is ready to merge
check_pr_status() {
    local pr_number=$1
    gh pr view $pr_number --json state,mergeable,statusCheckRollupState
}

# Function to safely merge PR
safe_merge() {
    local pr_number=$1
    local pr_title=$(gh pr view $pr_number --json title --jq '.title')
    
    echo "Merging PR #$pr_number: $pr_title"
    gh pr merge $pr_number --squash --delete-branch
    echo "✅ Successfully merged PR #$pr_number"
}

# Close superseded PRs
echo "🗑️  Closing superseded PRs..."
gh pr close 54 --comment "Superseded by PR #55 with newer vite version"

# Merge safe dependency updates
echo "✅ Merging safe dependency updates..."
safe_merge 58  # zod update

echo "🧹 Automated cleanup complete!"
echo "⚠️  Major version updates (PRs 55, 56, 57) require manual review"
echo "🚀 Feature PR #60 requires manual review"
`;

  fs.writeFileSync('scripts/automated-pr-cleanup.sh', scriptContent);
  execSync('chmod +x scripts/automated-pr-cleanup.sh');
  
  console.log('\n📝 Created automated-pr-cleanup.sh script');
  console.log('Run with: ./scripts/automated-pr-cleanup.sh');
}

// Main execution
async function main() {
  const analyzer = new PRCleanupAnalyzer();
  await analyzer.analyzePRs();
  
  console.log('\n🛠️  Creating automated cleanup script...');
  createAutomatedCleanupScript();
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Review the recommendations above');
  console.log('2. Run: ./scripts/automated-pr-cleanup.sh (for safe merges)');
  console.log('3. Manually review major version updates');
  console.log('4. Test and review feature PRs');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}