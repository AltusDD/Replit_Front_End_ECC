import type { Express } from "express";

export function installConfigRoutes(app: Express) {
  console.log("Installing config routes...");
  
  app.get("/api/config/test", async (_req, res) => {
    res.json({ ok: true, message: "Config route is working!" });
  });

  app.get("/api/config/integrations", async (_req, res) => {
    const env = process.env;
    const m365 =
      !!env.M365_CLIENT_ID &&
      !!env.M365_TENANT_ID &&
      (!!env.M365_CLIENT_SECRET || !!env.M365_AUTH_TENANT);
    const sharepoint = !!env.M365_SHAREPOINT_SITE_ID;
    const teamsDefault = !!env.M365_TEAMS_DEFAULT_TEAM_ID && !!env.M365_TEAMS_DEFAULT_CHANNEL_ID;
    const doorloop = !!env.DOORLOOP_API_KEY;
    const dropbox = !!env.DROPBOX_API_KEY || !!env.DROPBOX_ENABLED;
    const corelogic = !!env.CORELOGIC_ENABLED || !!env.CORELOGIC_API_KEY;

    return res.json({
      ok: true,
      integrations: {
        m365,
        sharepoint,
        teamsDefault,
        doorloop,
        dropbox,
        corelogic,
      },
    });
  });
}