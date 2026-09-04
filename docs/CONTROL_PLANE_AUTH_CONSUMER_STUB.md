# Control Plane authentication consumer stub

Status: repository-only, unbound, non-deployed.

## Consumer

- Application: ECC
- Candidate application ID: `ecc`
- Candidate client ID: `ecc-web`
- Initial capability used by proof: `ecc.read`
- Registration status: `unbound`

The IDs are consumer candidates until the Control Plane records the exact active
application, client, and redirect registration. No redirect URI, host, credential,
cookie, provider, or environment variable is configured by this change.

## Integration seam

The server adapter will later:

1. redirect a browser through the Control Plane authorization route using exact
   registered application/client/redirect values, PKCE S256, state, and nonce;
2. exchange the one-use code server-to-server;
3. validate the exact session response and issue this app's Secure, HttpOnly,
   SameSite application cookie;
4. call `POST /api/control/v1/access/integrate` with exactly
   `{applicationId, capability}` for current authorization;
5. display the exact developer-bypass banner only when that server response says
   `developer_bypass`;
6. navigate canonical administrators to the centrally hosted
   `/control/users` surface only after `control.admin.read` is granted; and
7. send application or global logout through the canonical logout contract.

The stub is fail-closed. Its default port returns `CONTROL_PLANE_NOT_BOUND`.
It does not read browser roles, billing, Team status, environment, developer
flags, Supabase tokens, or local authorization data. A developer bypass cannot
create an admin-console link.

## Current behavior and rollback

Existing authentication and routing are unchanged. There is no runtime import or
feature switch. Rollback is removal of the four files in this slice. A later,
separately authorized binding PR must supply registered endpoints, server-side
configuration, secure cookie handling, transport, observability, and browser
acceptance proof without weakening existing production authentication.

