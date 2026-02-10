"""
HTTP server for matching: POST /match with JSON body (type, job/profile, profiles/jobs).
Used by Express when ZMQ native module is not available (e.g. Windows). 
Run: python http_server.py  (listens on port 5000)
"""
import json
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from matcher import match_job, match_profile

PORT = int(os.environ.get("MATCHING_HTTP_PORT", "5000"))


class MatchHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/match":
            self.send_response(404)
            self.end_headers()
            return
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length).decode("utf-8") if length else "{}"
        try:
            msg = json.loads(body)
            req_type = msg.get("type")
            if req_type == "match_job":
                job = msg.get("job", {})
                profiles = msg.get("profiles", [])
                matches = match_job(job, profiles)
                response = {"matches": matches, "error": None}
            elif req_type == "match_profile":
                profile = msg.get("profile", {})
                jobs = msg.get("jobs", [])
                matches = match_profile(profile, jobs)
                response = {"matches": matches, "error": None}
            else:
                response = {"matches": [], "error": f"Unknown type: {req_type}"}
        except Exception as e:
            response = {"matches": [], "error": str(e)}
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(response).encode("utf-8"))

    def log_message(self, format, *args):
        print(format % args)


def main():
    server = HTTPServer(("", PORT), MatchHandler)
    print(f"Matching HTTP service on http://localhost:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    main()
