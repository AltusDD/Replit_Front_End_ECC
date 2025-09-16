#!/usr/bin/env tsx
import { Pool } from 'pg';
import { writeFileSync } from 'fs';

async function main() {
  console.log('🔧 Owner Transfer Migration Starting...');
  
  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL or SUPABASE_DB_URL is required');
  }

  const pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await pool.query('BEGIN');
    console.log('📦 Creating owner_transfers table...');
    
    // Create tables and columns (idempotent)
    const migrationSQL = `
      CREATE TABLE IF NOT EXISTS owner_transfers (
        id BIGSERIAL PRIMARY KEY
      );
      ALTER TABLE owner_transfers
        ADD COLUMN IF NOT EXISTS source_owner_id BIGINT,
        ADD COLUMN IF NOT EXISTS target_owner_id BIGINT,
        ADD COLUMN IF NOT EXISTS effective_date DATE,
        ADD COLUMN IF NOT EXISTS include JSONB,
        ADD COLUMN IF NOT EXISTS notes TEXT,
        ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'initiated',
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
      
      -- make required
      ALTER TABLE owner_transfers
        ALTER COLUMN effective_date SET NOT NULL,
        ALTER COLUMN include SET NOT NULL;

      CREATE TABLE IF NOT EXISTS owner_transfer_audit (
        id BIGSERIAL PRIMARY KEY
      );
      ALTER TABLE owner_transfer_audit
        ADD COLUMN IF NOT EXISTS transfer_id BIGINT,
        ADD COLUMN IF NOT EXISTS action TEXT,
        ADD COLUMN IF NOT EXISTS actor TEXT DEFAULT 'system',
        ADD COLUMN IF NOT EXISTS detail JSONB,
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
      ALTER TABLE owner_transfer_audit
        ALTER COLUMN action SET NOT NULL;

      -- Add FKs only if targets exist and FK not present
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='owners') THEN
          IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='owner_transfers_source_owner_id_fkey') THEN
            ALTER TABLE owner_transfers
              ADD CONSTRAINT owner_transfers_source_owner_id_fkey
              FOREIGN KEY (source_owner_id) REFERENCES owners(id);
          END IF;
          IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='owner_transfers_target_owner_id_fkey') THEN
            ALTER TABLE owner_transfers
              ADD CONSTRAINT owner_transfers_target_owner_id_fkey
              FOREIGN KEY (target_owner_id) REFERENCES owners(id);
          END IF;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='owner_transfer_audit_transfer_id_fkey') THEN
          ALTER TABLE owner_transfer_audit
            ADD CONSTRAINT owner_transfer_audit_transfer_id_fkey
            FOREIGN KEY (transfer_id) REFERENCES owner_transfers(id);
        END IF;
      END$$;

      CREATE INDEX IF NOT EXISTS idx_owner_transfers_source_owner_id ON owner_transfers(source_owner_id);
      CREATE INDEX IF NOT EXISTS idx_owner_transfers_target_owner_id ON owner_transfers(target_owner_id);
      CREATE INDEX IF NOT EXISTS idx_owner_transfer_audit_transfer_id ON owner_transfer_audit(transfer_id);
    `;

    await pool.query(migrationSQL);
    console.log('✅ Tables and indexes created');

    // Seeding logic
    const ownersExist = await pool.query(
      "SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='owners')"
    );

    if (ownersExist.rows[0].exists) {
      console.log('🌱 owners table exists, checking for seeding...');
      
      const transferCount = await pool.query('SELECT COUNT(*) as count FROM owner_transfers');
      
      if (parseInt(transferCount.rows[0].count) === 0) {
        console.log('💾 Seeding initial transfer...');
        
        const owners = await pool.query('SELECT id FROM owners LIMIT 2');
        
        if (owners.rows.length > 0) {
          const sourceId = owners.rows[0].id;
          const targetId = owners.rows.length > 1 ? owners.rows[1].id : owners.rows[0].id;
          
          const transferResult = await pool.query(`
            INSERT INTO owner_transfers 
            (source_owner_id, target_owner_id, effective_date, include, notes, status)
            VALUES ($1, $2, CURRENT_DATE, '{"properties": true, "units": true}', 'Initial seeded transfer', 'initiated')
            RETURNING id
          `, [sourceId, targetId]);
          
          const transferId = transferResult.rows[0].id;
          
          await pool.query(`
            INSERT INTO owner_transfer_audit 
            (transfer_id, action, actor, detail)
            VALUES ($1, 'seeded', 'system', '{"message": "Initial seed data created"}')
          `, [transferId]);
          
          writeFileSync('tools/.last_transfer_id', transferId.toString());
          console.log(`✅ Seeded transfer ID: ${transferId}`);
        } else {
          console.log('⚠️  No owners found for seeding');
        }
      } else {
        console.log('ℹ️  Transfer data already exists, skipping seed');
      }
    } else {
      console.log('⚠️  owners table does not exist, skipping seeding');
    }

    await pool.query('COMMIT');
    console.log('🎉 Migration completed successfully!');

  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}