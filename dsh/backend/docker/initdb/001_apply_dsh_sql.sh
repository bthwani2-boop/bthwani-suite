#!/usr/bin/env bash
set -euo pipefail

run_sql_dir() {
  local dir="$1"
  if [ ! -d "$dir" ]; then
    return 0
  fi

  for file in "$dir"/*.sql; do
    if [ ! -f "$file" ]; then
      continue
    fi
    echo "dsh-postgres-init: applying $file"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f "$file"
  done
}

run_sql_dir /dsh-migrations
run_sql_dir /dsh-seed
