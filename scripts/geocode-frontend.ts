// Frontend script to geocode all properties via API
// This can be run from the browser console or as a standalone script

const BATCH_SIZE = 5; // Process 5 properties at a time to avoid rate limits

async function geocodeAllProperties() {
  console.log("🗺️ Starting property geocoding...");
  
  try {
    // Get all properties
    const response = await fetch('/api/portfolio/properties');
    if (!response.ok) {
      throw new Error(`Failed to fetch properties: ${response.statusText}`);
    }
    
    const properties = await response.json();
    console.log(`📍 Found ${properties.length} properties to process`);
    
    // Filter properties that need geocoding (missing lat/lng)
    const needsGeocoding = properties.filter(p => 
      !p.lat || !p.lng || p.lat === 0 || p.lng === 0 || p.lat === null || p.lng === null
    );
    
    console.log(`🎯 ${needsGeocoding.length} properties need geocoding`);
    
    if (needsGeocoding.length === 0) {
      console.log("✅ All properties already have coordinates!");
      return;
    }
    
    // Process in batches
    const batches = [];
    for (let i = 0; i < needsGeocoding.length; i += BATCH_SIZE) {
      batches.push(needsGeocoding.slice(i, i + BATCH_SIZE));
    }
    
    console.log(`📦 Processing ${batches.length} batches of ${BATCH_SIZE} properties each`);
    
    let totalSuccess = 0;
    let totalFailed = 0;
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`[${i + 1}/${batches.length}] Processing batch with ${batch.length} properties...`);
      
      try {
        const geocodeResponse = await fetch('/api/geocode/properties', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ properties: batch }),
        });
        
        if (!geocodeResponse.ok) {
          throw new Error(`Geocoding API failed: ${geocodeResponse.statusText}`);
        }
        
        const { results } = await geocodeResponse.json();
        
        for (const result of results) {
          if (result.success) {
            totalSuccess++;
            console.log(`✅ Property ${result.id}: ${result.lat}, ${result.lng} (${result.provider})`);
            if (result.dbUpdateFailed) {
              console.warn(`⚠️ Property ${result.id}: Geocoded but DB update failed (${result.error})`);
            }
          } else {
            totalFailed++;
            console.log(`❌ Property ${result.id}: ${result.error}`);
          }
        }
        
        // Wait between batches to respect rate limits
        if (i < batches.length - 1) {
          console.log("⏳ Waiting 2 seconds before next batch...");
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
      } catch (error) {
        console.error(`💥 Error processing batch ${i + 1}:`, error);
        totalFailed += batch.length;
      }
    }
    
    console.log("\n🎉 Geocoding complete!");
    console.log(`✅ Successfully geocoded: ${totalSuccess}`);
    console.log(`❌ Failed to geocode: ${totalFailed}`);
    console.log(`📍 Total processed: ${totalSuccess + totalFailed}`);
    
    // Refresh the page to see updated map
    console.log("🔄 Refreshing page to show updated map...");
    window.location.reload();
    
  } catch (error) {
    console.error("💥 Fatal error during geocoding:", error);
  }
}

// Export for use in browser console
(window as any).geocodeAllProperties = geocodeAllProperties;

console.log("🗺️ Geocoding script loaded! Run geocodeAllProperties() to start.");

export { geocodeAllProperties };