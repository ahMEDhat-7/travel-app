#!/bin/sh
set -e

# ──────────────────────────────────────────────
# PostgreSQL Backup Script
# Runs daily via cron inside the db container
# ──────────────────────────────────────────────

BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/sharmcloudtours_${TIMESTAMP}.sql.gz"
KEEP_DAYS=7

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

# Run pg_dump and compress
pg_dump -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" \
  --format=custom \
  --compress=9 \
  --verbose \
  2>/dev/null | gzip > "${BACKUP_FILE}"

# Verify backup was created
if [ -f "${BACKUP_FILE}" ]; then
  SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
  echo "[Backup] Success: ${BACKUP_FILE} (${SIZE})"
else
  echo "[Backup] ERROR: Failed to create backup"
  exit 1
fi

# Remove backups older than KEEP_DAYS
find "${BACKUP_DIR}" -name "sharmcloudtours_*.sql.gz" -type f -mtime +${KEEP_DAYS} -delete 2>/dev/null

REMAINING=$(find "${BACKUP_DIR}" -name "sharmcloudtours_*.sql.gz" -type f | wc -l)
echo "[Backup] Retained: ${REMAINING} backup(s) (keeping last ${KEEP_DAYS} days)"
