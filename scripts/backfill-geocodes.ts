import "dotenv/config";
import PQueue from "p-queue";
import { pool } from "../server/db";
import { geocode } from "../server/lib/geocode";

const queue = new PQueue({ concurrency: 2, interval: 1000, intervalCap: 2 });

async function backfillGeocode() {
  console.log("🗺️  Starting geocoding backfill...");

  // Get all properties without coordinates
  const { rows } = await pool.query(`
    SELECT id, property_address, property_name, lat, lng
    FROM properties
    WHERE lat IS NULL OR lng IS NULL OR lat = 0 OR lng = 0
    ORDER BY id
  `);

  console.log(`Found ${rows.length} properties missing coordinates`);

  for (const [index, property] of rows.entries()) {
    const { id, property_address, property_name } = property;
    
    // Try property_address first, fallback to property_name
    const addressToGeocode = property_address || property_name;
    if (!addressToGeocode) {
      console.log(`Skipping property ${id}: no address available`);
      continue;
    }

    queue.add(async () => {
      try {
        console.log(`[${index + 1}/${rows.length}] Geocoding property ${id}: "${addressToGeocode}"`);
        
        const result = await geocode(addressToGeocode);
        
        if (result) {
          await pool.query(
            `UPDATE properties SET lat = $1, lng = $2 WHERE id = $3`,
            [result.lat, result.lng, id]
          );
          console.log(`✅ Property ${id} geocoded to: ${result.lat}, ${result.lng} (${result.provider})`);
        } else {
          console.log(`❌ Failed to geocode property ${id}: "${addressToGeocode}"`);
        }
      } catch (error) {
        console.error(`Error geocoding property ${id}:`, error);
      }
    });
  }

  await queue.onIdle();
  console.log("🎉 Geocoding backfill complete!");
  
  // Final count
  const { rows: updated } = await pool.query(`
    SELECT COUNT(*) as count
    FROM properties 
    WHERE lat IS NOT NULL AND lng IS NOT NULL AND lat != 0 AND lng != 0
  `);
  
  console.log(`📍 Total properties with coordinates: ${updated[0].count}`);
  
  process.exit(0);
}

backfillGeocode().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});