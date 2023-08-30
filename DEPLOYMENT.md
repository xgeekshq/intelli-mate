# Deployment guide

intelli-mate was created with the standalone platform format in mind. In order to be easily customized and adopted by a multitude of companies, it needs a well-defined guide to deploy this in the most common cloud providers.

The product is cloud native ready by leveraging kubernetes, meaning that you won't have any issues with automatic scaling due to traffic spikes or any other motives and that you won't have issues with which cloud provider to use as the solution for deployment is very cloud platform agnostic.

## Dependencies

To deploy the solution there are certain pre-requisites in terms of infrastructure that you need to have setup in your favorite cloud provider:

- Helm
- Redis
- MongoDB
- File storage volume

## How to deploy

Most of the setup is done in the helm charts `values` files, e.g: `/helm/intelli-mate-api/values/production.yaml`.
The default values can always be checked in the `/helm/intelli-mate-api/values.yaml` as any other helm chart, but should be overriden in the specific environments like `production`, `staging`, etc.

### Secrets



### File storage persistence

To leverage a shared file storage between the API pods, we need a volume and to create a volume in your cloud provider, we need a storage class.

E.g:
> With a terminal that has access to your k8s cluster, you enter `kubectl get storageclasses.storage.k8s.io` and you should be able to replace that value in the `values.persistence.storageClass` property.


