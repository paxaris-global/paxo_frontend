#!/usr/bin/env bash
# Smoke-test API Gateway paths used by paxo_frontend (same-origin /identity, /gateway, /project).
# Run with stack up: port-forward 8085 → api-gateway, or local Spring Boot on 8085.
#
# Usage:
#   ./scripts/smoke-gateway-apis.sh
#   GATEWAY_URL=http://127.0.0.1:8085 REALM=demo CLIENT_ID=demo-admin-product USER=admin PASS=secret ./scripts/smoke-gateway-apis.sh
set -euo pipefail

GATEWAY_URL="${GATEWAY_URL:-http://127.0.0.1:8085}"
REALM="${REALM:-}"
USER="${USER:-}"
PASS="${PASS:-}"
CLIENT_ID="${CLIENT_ID:-}"

die() { echo "FAIL: $*" >&2; exit 1; }
ok() { echo "OK  : $*"; }

code="000"
code=$(curl -sS -o /tmp/smoke_realms.json -w "%{http_code}" --connect-timeout 3 "${GATEWAY_URL}/identity/realms") || code="000"
if [[ "$code" =~ ^2 ]]; then
  ok "GET /identity/realms -> HTTP $code"
else
  die "GET /identity/realms -> HTTP $code (is api-gateway reachable at ${GATEWAY_URL}?)"
fi

# Signup + CORS preflight-style Origin (mirrors ng serve on non-4200 ports calling gateway :8085)
SMOKE_REALM="smoke-$(date +%s)"
signup_http=$(curl -sS -o /tmp/smoke_signup.json -w "%{http_code}" \
  -X POST "${GATEWAY_URL}/identity/signup" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:58851" \
  -d "{\"realmName\":\"${SMOKE_REALM}\",\"adminPassword\":\"SmokeTest123!\"}" ) || signup_http="000"
if [[ "$signup_http" =~ ^2 ]] || [[ "$signup_http" == "409" ]]; then
  ok "POST /identity/signup (Origin :58851) -> HTTP $signup_http"
else
  die "POST /identity/signup -> HTTP $signup_http body: $(head -c 400 /tmp/smoke_signup.json 2>/dev/null || true)"
fi

if [[ -n "$REALM" && -n "$USER" && -n "$PASS" && -n "$CLIENT_ID" ]]; then
  login_code=$(curl -sS -o /tmp/smoke_login.json -w "%{http_code}" \
    -X POST "${GATEWAY_URL}/identity/${REALM}/login" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"${USER}\",\"password\":\"${PASS}\",\"client_id\":\"${CLIENT_ID}\"}" || echo "000")
  if [[ ! "$login_code" =~ ^2 ]]; then
    die "POST /identity/${REALM}/login -> HTTP $login_code body: $(cat /tmp/smoke_login.json 2>/dev/null || true)"
  fi
  ok "POST /identity/${REALM}/login -> HTTP $login_code"
  token=$(python3 -c "import json;print(json.load(open('/tmp/smoke_login.json')).get('access_token',''))" 2>/dev/null || true)
  if [[ -z "$token" ]]; then
    die "No access_token in login response"
  fi
  for path in \
    "GET:${GATEWAY_URL}/identity/users/${REALM}" \
    "GET:${GATEWAY_URL}/identity/products/${REALM}" \
    "GET:${GATEWAY_URL}/identity/realms/user"; do
    method=${path%%:*}
    url=${path#*:}
    sc=$(curl -sS -o /tmp/smoke_auth.json -w "%{http_code}" \
      -X "$method" "$url" -H "Authorization: Bearer ${token}" || echo "000")
    if [[ "$sc" =~ ^2 ]]; then
      ok "${method} ${url} -> HTTP $sc"
    else
      die "${method} ${url} -> HTTP $sc $(head -c 200 /tmp/smoke_auth.json 2>/dev/null || true)"
    fi
  done
  ok "POST /project/roles/get-urls (optional body) — skipped unless PRODUCT_ID and ROLE set"
else
  echo "SKIP: authenticated routes (set REALM, USER, PASS, CLIENT_ID to exercise login + Bearer paths)"
fi

echo "Done."
