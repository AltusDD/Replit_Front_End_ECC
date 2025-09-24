import os, json, azure.functions as func, os as _os

ADMIN = os.environ.get("ADMIN_SYNC_TOKEN")

def main(req: func.HttpRequest) -> func.HttpResponse:
    if not ADMIN or req.headers.get("x-admin-token") != ADMIN:
        return func.HttpResponse(json.dumps({"error": "unauthorized"}), status_code=401, mimetype="application/json")
    try:
        body = req.get_json() if req.get_body() else {}
        step = _os.path.basename(_os.path.dirname(__file__)).split("owners-")[-1]
        return func.HttpResponse(json.dumps({"ok": True, "step": step, "transferId": body.get("transferId")}), mimetype="application/json")
    except Exception as e:
        return func.HttpResponse(json.dumps({"error": "server_error", "detail": str(e)}), status_code=500, mimetype="application/json")