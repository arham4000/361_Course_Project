"""
ZMQ REP server: accepts match_job and match_profile requests, returns matches with score and criteria.
"""
import json
import signal
import os
import zmq
from matcher import match_job, match_profile

BIND = os.environ.get("ZMQ_BIND", "tcp://*:5555")


def main():
    context = zmq.Context()
    sock = context.socket(zmq.REP)
    sock.bind(BIND)
    print(f"Matching service listening on {BIND}")

    def shutdown(signum=None, frame=None):
        sock.close()
        context.term()
        raise SystemExit(0)

    signal.signal(signal.SIGTERM, shutdown)
    signal.signal(signal.SIGINT, shutdown)

    while True:
        try:
            raw = sock.recv_string()
            msg = json.loads(raw)
            req_type = msg.get("type")
            if req_type == "match_job":
                job = msg.get("job", {})
                profiles = msg.get("profiles", [])
                matches = match_job(job, profiles)
                sock.send_string(json.dumps({"matches": matches, "error": None}))
            elif req_type == "match_profile":
                profile = msg.get("profile", {})
                jobs = msg.get("jobs", [])
                matches = match_profile(profile, jobs)
                sock.send_string(json.dumps({"matches": matches, "error": None}))
            else:
                sock.send_string(
                    json.dumps({"matches": [], "error": f"Unknown type: {req_type}"})
                )
        except json.JSONDecodeError as e:
            sock.send_string(json.dumps({"matches": [], "error": str(e)}))
        except Exception as e:
            sock.send_string(json.dumps({"matches": [], "error": str(e)}))


if __name__ == "__main__":
    main()
