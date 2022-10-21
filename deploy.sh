#!/bin/bash
set -e

export PROJECT_ID="macfor-74649"

export SERVICES=(
  "firebase-admin-auth"
)

export PORTS=(
  "3001"
)

export CURRENT_BRANCH=$(git branch --show-current | tr '[:upper:]' '[:lower:]')
export COMMIT_ID=$(git rev-parse --verify HEAD)


for i in ${!SERVICES[@]}; do
  export SERVICE=${SERVICES[$i]}
  export PORT=${PORTS[$i]}

  docker-compose -f "docker-compose.yml" build service

  docker push gcr.io/$PROJECT_ID/${SERVICES[$i]}:$COMMIT_ID

  gcloud run deploy ${SERVICES[$i]} \
          --image=gcr.io/$PROJECT_ID/${SERVICES[$i]}:$COMMIT_ID \
          --platform=managed \
          --allow-unauthenticated \
          --no-cpu-throttling \
          --port=${PORTS[$i]} \
          --memory=512Mi \
          --timeout=60 \
          --region=us-central1 \
          --max-instances=100 \
          --project=$PROJECT_ID

done