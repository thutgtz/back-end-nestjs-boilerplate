#!/bin/bash
trap "echo; exit" INT

environment=$( git rev-parse --abbrev-ref HEAD )
echo $environment
if [ $environment == "main" ]; then
   environment="prod"
elif [ $environment == "uat" ]; then 
   environment="uat"
else 
   environment="dev"
fi

service_name=back-end-${environment}
docker_registry=454279134504.dkr.ecr.ap-southeast-1.amazonaws.com
registry_name=my-repository
docker_image=$docker_registry/${registry_name}:${service_name}


echo "step 1 - build docker image $docker_image"
docker buildx build --platform linux/amd64 -t $docker_image --build-arg ENV_FILE=$environment .
echo "step 2 - login to aws registy"
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin $docker_registry
echo "step 3 - push docker image $docker_image"
docker push $docker_image
echo "step 4 - revision container ecs $environment"
aws ecs update-service --cluster ecs-${environment}-cluster --service $service_name --force-new-deployment
