import os, json, urllib.request, urllib.parse, azure.functions as func

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

def _sb(table, params):
    qs = urllib.parse.urlencode(params, doseq=True)
    url = f"{SUPABASE_URL}/rest/v1/{table}?{qs}"
    req = urllib.request.Request(url, headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"})
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read().decode("utf-8") or "null")

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        src = req.params.get("sourceOwnerId")
        if not src:
            return func.HttpResponse(json.dumps({"error": "missing_sourceOwnerId"}), status_code=400, mimetype="application/json")
        owner = _sb("owners", {"id": f"eq.{src}", "select": "id,display_name,primary_email,primary_phone"})
        ctx = {"sourceOwner": (owner[0] if isinstance(owner, list) and owner else owner), "canTransfer": bool(owner)}
        return func.HttpResponse(json.dumps(ctx), mimetype="application/json")
    except Exception as e:
        return func.HttpResponse(json.dumps({"error": "server_error", "detail": str(e)}), status_code=500, mimetype="application/json")