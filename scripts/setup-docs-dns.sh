#!/usr/bin/env bash
set -euo pipefail

# Configure Mintlify custom-domain DNS for docs.sifr.sh on Cloudflare.
# Requires CLOUDFLARE_API_TOKEN with Zone.DNS Edit for sifr.sh.

ZONE_ID="${CLOUDFLARE_ZONE_ID:-6946217b48c1c400d570c9380996a3e5}"
API_BASE="https://api.cloudflare.com/client/v4"

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  echo "error: set CLOUDFLARE_API_TOKEN (Zone → DNS → Edit for sifr.sh)" >&2
  exit 1
fi

auth_header=(-H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" -H "Content-Type: application/json")

cf_api() {
  local method="$1"
  local path="$2"
  local data="${3:-}"
  if [[ -n "$data" ]]; then
    curl -sS -X "$method" "${API_BASE}${path}" "${auth_header[@]}" -d "$data"
  else
    curl -sS -X "$method" "${API_BASE}${path}" "${auth_header[@]}"
  fi
}

upsert_record() {
  local type="$1"
  local name="$2"
  local content="$3"
  local proxied="${4:-false}"

  local existing
  existing="$(cf_api GET "/zones/${ZONE_ID}/dns_records?type=${type}&name=${name}")"
  local success
  success="$(echo "$existing" | python3 -c "import json,sys; print(json.load(sys.stdin).get('success', False))")"
  if [[ "$success" != "True" ]]; then
    echo "error: failed to list records for ${name}" >&2
    echo "$existing" | python3 -m json.tool >&2 || echo "$existing" >&2
    exit 1
  fi

  local record_id
  record_id="$(echo "$existing" | python3 -c "
import json,sys
data=json.load(sys.stdin)
results=data.get('result') or []
print(results[0]['id'] if results else '')
")"

  local payload
  if [[ "$type" == "CNAME" ]]; then
    payload="$(python3 -c "import json; print(json.dumps({'type':'CNAME','name':'${name}','content':'${content}','proxied':${proxied},'ttl':1}))")"
  else
    payload="$(python3 -c "import json; print(json.dumps({'type':'TXT','name':'${name}','content':'${content}','ttl':1}))")"
  fi

  local resp
  if [[ -n "$record_id" ]]; then
    echo "Updating ${type} ${name} ..."
    resp="$(cf_api PUT "/zones/${ZONE_ID}/dns_records/${record_id}" "$payload")"
  else
    echo "Creating ${type} ${name} ..."
    resp="$(cf_api POST "/zones/${ZONE_ID}/dns_records" "$payload")"
  fi

  echo "$resp" | python3 -c "
import json,sys
data=json.load(sys.stdin)
if not data.get('success'):
    print('error:', data.get('errors'), file=sys.stderr)
    sys.exit(1)
r=data['result']
print(f\"  ok: {r['type']} {r['name']} -> {r['content']} (proxied={r.get('proxied', False)})\")
"
}

echo "Setting up Mintlify DNS for docs.sifr.sh (zone ${ZONE_ID})"

upsert_record TXT "_acme-challenge.docs.sifr.sh" "0hrn1sglxnV0D1itEDVVZP5Pgz8bOyRnydBbm3KRnA4"
upsert_record TXT "_cf-custom-hostname.docs.sifr.sh" "835fd1e1-3d9b-4bb2-8e96-8ccb96c06caa"
upsert_record CNAME "docs.sifr.sh" "cname.mintlify.builders" false

echo ""
echo "Done. Verify with:"
echo "  dig +short TXT _acme-challenge.docs.sifr.sh"
echo "  dig +short TXT _cf-custom-hostname.docs.sifr.sh"
echo "  dig +short docs.sifr.sh CNAME"
