import os, json, urllib.request, urllib.parse, azure.functions as func, os as _os

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
TABLE = _os.path.basename(_os.path.dirname(__file__)).split("-")[-1]

def _sb(path, params):
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise RuntimeError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    qs = urllib.parse.urlencode(params, doseq=True)
    url = f"{SUPABASE_URL}/rest/v1/{path}?{qs}"
    req = urllib.request.Request(url, headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"})
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read().decode("utf-8") or "null")

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        params = {}
        for k in ("select", "limit", "order"):
            v = req.params.get(k)
            if v:
                params[k] = v
        rid = req.route_params.get("id")
        if rid:
            params["id"] = f"eq.{rid}"
        else:
            params.setdefault("select", "*")
        data = _sb(TABLE, params)
        if rid and isinstance(data, list) and len(data) == 1:
            data = data[0]
        return func.HttpResponse(json.dumps(data), mimetype="application/json")
    except urllib.error.HTTPError as e:
        return func.HttpResponse(json.dumps({"error": "supabase_http_error", "status": e.code}), status_code=502, mimetype="application/json")
    except Exception as e:
        return func.HttpResponse(json.dumps({"error": "server_error", "detail": str(e)}), status_code=500, mimetype="application/json")