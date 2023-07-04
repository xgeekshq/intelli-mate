#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

helpFunction()
{
echo ""
  echo "Usage: $0 -e <ENV> -n <NAMESPACE>"
  echo -e "\t-e Target Environment to deploy the application"
  echo -e "\t-n Target Namespace to deploy the application"
  echo -e "\t-t Target Version Tag to deploy the application"
  echo -e "\t-r Target Release to deploy the application"
  exit 1 # Exit script after printing help
}

while getopts "e:n:t:r:" opt
do
  case "$opt" in
    e ) targetEnvironment="$OPTARG" ;;
    n ) targetNamespace="$OPTARG" ;;
    t ) targetVersion="$OPTARG" ;;
    r ) targetRelease="$OPTARG" ;;
    ? ) helpFunction ;; # Print helpFunction in case parameter is non-existent
  esac
done

# Print helpFunction in case parameters are empty
if [ -z "${targetEnvironment:-}" ]
then
   echo "Target Environment parameter is missing.";
   helpFunction
fi

if [ -z "${targetNamespace:-}" ]
then
   echo "Target Namespace parameter is missing.";
   helpFunction
fi

if [ -z "${targetRelease:-}" ]
then
   echo "Target Release parameter is missing.";
   helpFunction
fi

if [ -z "${targetVersion:-}" ]
then
    IMAGE_VERSION=$(git rev-parse origin/main)
else
    IMAGE_VERSION=$targetVersion
fi

echo "Deploying Application (tag:${IMAGE_VERSION}) to ${targetEnvironment}..."
targetEnvironment=$(echo "${targetEnvironment}" | awk '{print tolower($0)}')

echo "Applying Helm upgrade for Application..."
# Install helm chart for Application
DEPLOYMENT_NAMESPACE=${targetNamespace}
DEPLOYMENT_RELEASE=${targetRelease}

helm upgrade "${DEPLOYMENT_RELEASE}" \
--install ./"${DEPLOYMENT_RELEASE}"/ \
--namespace "${DEPLOYMENT_NAMESPACE}" \
--reset-values \
--values ./"${DEPLOYMENT_RELEASE}"/values/"${targetEnvironment}".yaml \
--set image.tag="${IMAGE_VERSION}" \
--timeout 5m \
--atomic

# Verify if Helm Chart is deployed successfully, if not then try to Rollback
if helm test --logs "${DEPLOYMENT_RELEASE}" -n "${DEPLOYMENT_NAMESPACE}" ; then
    echo "Helm Chart deployed successfully"
else
    echo "Helm Chart deployment failed, rolling back"
    helm rollback "${DEPLOYMENT_RELEASE}" -n "${DEPLOYMENT_NAMESPACE}" 
    if helm test --logs "${DEPLOYMENT_RELEASE}" -n "${DEPLOYMENT_NAMESPACE}" ; then
        echo "Helm Chart failed, but rolled back successfully"
    else
        echo "Helm Chart deployment and rollback failed, uninstalling"
        helm uninstall "${DEPLOYMENT_RELEASE}" -n "${DEPLOYMENT_NAMESPACE}" 
    fi
    exit 1
fi
