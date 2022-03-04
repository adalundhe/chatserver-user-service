DOCKERFILE_PATH=${DOCKERFILE_PATH:-"./"}

docker build -t chat-user-server:latest \
 --no-cache \
 --target=run \
  ${DOCKERFILE_PATH}