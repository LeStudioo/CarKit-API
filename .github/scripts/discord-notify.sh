#!/bin/bash

WEBHOOK_URL=$1
STATUS=$2
FIELDS_JSON=$3

COLOR_SUCCESS=3066993    # Vert
COLOR_FAILURE=15158332   # Rouge
COLOR_WARNING=16776960   # Orange
COLOR_INFO=3447003       # Bleu

case $STATUS in
  "ci_success")
    TITLE="✅ CI Pipeline Succeeded"
    DESCRIPTION="All checks passed successfully!"
    COLOR=$COLOR_SUCCESS
    ;;
  "ci_failure")
    TITLE="❌ CI Pipeline Failed"
    DESCRIPTION="The pipeline encountered errors!"
    COLOR=$COLOR_FAILURE
    ;;
  "ci_warning")
    TITLE="⚠️ Security Vulnerabilities Detected"
    DESCRIPTION="Tests passed but security issues were found!"
    COLOR=$COLOR_WARNING
    ;;
  "deploy_start")
    TITLE="🚀 Deployment Started"
    DESCRIPTION="Deploying to production environment..."
    COLOR=$COLOR_INFO
    ;;
  "deploy_success")
    TITLE="✅ Deployment Successful"
    DESCRIPTION="Application successfully deployed to production!"
    COLOR=$COLOR_SUCCESS
    ;;
  "deploy_failure")
    TITLE="❌ Deployment Failed"
    DESCRIPTION="Failed to deploy application to production!"
    COLOR=$COLOR_FAILURE
    ;;
  *)
    TITLE="ℹ️ Notification"
    DESCRIPTION="GitHub Actions notification"
    COLOR=$COLOR_INFO
    ;;
esac

TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%S.000Z)

PAYLOAD=$(cat <<EOF
{
  "embeds": [{
    "title": "$TITLE",
    "description": "$DESCRIPTION",
    "color": $COLOR,
    "fields": $FIELDS_JSON,
    "timestamp": "$TIMESTAMP",
    "footer": {"text": "GitHub Actions"}
  }]
}
EOF
)

curl -H "Content-Type: application/json" \
     -X POST \
     -d "$PAYLOAD" \
     "$WEBHOOK_URL"

echo "Discord notification sent: $TITLE"