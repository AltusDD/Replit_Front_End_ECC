import json, secrets, azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        body = req.get_json() if req.get_body() else {}
        return func.HttpResponse(json.dumps({"transferId": secrets.token_hex(12), "ok": True, "echo": body}), mimetype="application/json")
    except Exception as e:
        return func.HttpResponse(json.dumps({"error": "server_error", "detail": str(e)}), status_code=500, mimetype="application/json")