#!/usr/bin/env bash
# Run from a built release directory: bash scripts/activate-vps-release.sh COMMIT
set -Eeuo pipefail
expected="${1:?Pass the full commit hash}"
release="$(pwd -P)"
case "$release" in /srv/yellostack/releases/*) ;; *) echo 'Run this inside the new VPS release directory.'; exit 1;; esac
test "$(git rev-parse HEAD)" = "$expected"
test -s "$release/.next/BUILD_ID"
test -L /srv/yellostack/current
previous="$(readlink -f /srv/yellostack/current)"
test -s "$previous/.next/BUILD_ID"
test "$previous" != "$release"
sudo -v
sudo test -s /var/lib/yellostack/store.json
sudo test -s /etc/yellostack/environment
# Verify the running service actually uses the persistent store before changing it.
pid="$(systemctl show yellostack -p MainPID --value)"
sudo python3 - "$pid" <<'PY'
import pathlib,sys
values=pathlib.Path('/proc/'+sys.argv[1]+'/environ').read_bytes().split(b'\0')
env=dict(item.split(b'=',1) for item in values if b'=' in item)
assert env.get(b'CMS_DATA_DIR')==b'/var/lib/yellostack', 'Unexpected CMS_DATA_DIR: stop and inspect service configuration'
assert env.get(b'CMS_BACKEND',b'local')==b'local', 'Unexpected CMS backend'
PY
sudo chown -R yellostack:yellostack "$release/.next"
printf '%s\n' "$previous" | sudo tee /srv/yellostack/previous-release >/dev/null
sudo install -d -m 700 /var/backups/yellostack
backup="/var/backups/yellostack/before-mobile-apps-$(date +%Y%m%d-%H%M%S).tar.gz"
pending="/srv/yellostack/current-mobile-apps-$$"
rollback() {
 trap - ERR INT TERM
 echo 'Activation failed. Restoring previous code; CMS data is left untouched.'
 sudo ln -sfnT "$previous" "$pending"
 sudo mv -Tf "$pending" /srv/yellostack/current
 sudo systemctl restart yellostack
 exit 1
}
trap rollback ERR INT TERM
sudo systemctl stop yellostack
sudo test ! -d /var/lib/yellostack/write.lock
sudo sh -c 'umask 077; tar -czf "$1" -C / var/lib/yellostack etc/yellostack' sh "$backup"
sudo tar -tzf "$backup" >/dev/null
sudo ln -sT "$release" "$pending"
sudo mv -Tf "$pending" /srv/yellostack/current
sudo systemctl restart yellostack
healthy=false
for attempt in {1..20}; do
 if curl -fsS --max-time 5 http://127.0.0.1:3000/api/cms/status 2>/dev/null | python3 -c 'import json,sys; d=json.load(sys.stdin); assert d.get("configured") and d.get("backend")=="local"' 2>/dev/null; then healthy=true; break; fi
 sleep 2
done
test "$healthy" = true
for route in / /admin /portfolio/projects/mobile-apps; do
 curl -fsS --max-time 30 "http://127.0.0.1:3000$route" >/dev/null
done
# Confirm saved drafts, published content, media and private settings match the backup.
sudo python3 - "$backup" <<'PY'
import json,pathlib,tarfile,sys,hashlib
with tarfile.open(sys.argv[1]) as archive:
 old=json.load(archive.extractfile('var/lib/yellostack/store.json'))
 current=json.loads(pathlib.Path('/var/lib/yellostack/store.json').read_text())
 for key in ('content','published','revision','smtpEncrypted'):
  assert old.get(key)==current.get(key), 'Persistent CMS state changed: '+key
 for member in archive.getmembers():
  if member.isfile() and member.name!='var/lib/yellostack/store.json':
   now=pathlib.Path('/'+member.name)
   assert now.is_file(), 'Missing persistent file'
   assert hashlib.sha256(archive.extractfile(member).read()).digest()==hashlib.sha256(now.read_bytes()).digest(), 'Persistent file changed'
print('Verified: saved content, uploaded files and private settings preserved.')
PY
trap - ERR INT TERM
echo "SUCCESS: activated $expected"
echo "Backup: $backup"
echo "Previous code: $previous"
