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
        q = (req.params.get("q") or "").strip()
        params = {"select": "id,display_name,primary_email,primary_phone"}
        if q:
            params["display_name"] = f"ilike.%{q}%"
        data = _sb("owners", params)
        return func.HttpResponse(json.dumps(data), mimetype="application/json")
    except Exception as e:
        return func.HttpResponse(json.dumps({"error": "server_error", "detail": str(e)}), status_code=500, mimetype="application/json")