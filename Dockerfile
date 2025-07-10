# Build stage
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
# Install yarn, git and timezone data
RUN apk add --no-cache yarn tzdata git
# Set timezone
ENV TZ=Asia/Shanghai
RUN yarn install
COPY . .
RUN yarn build

# Production stage
FROM nginx:stable-alpine as production-stage
# Copy timezone data and set timezone in the production image as well
COPY --from=build-stage /usr/share/zoneinfo/Asia/Shanghai /usr/share/zoneinfo/Asia/Shanghai
ENV TZ=Asia/Shanghai
COPY --from=build-stage /app/cdnSlope /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8088
CMD ["nginx", "-g", "daemon off;"]
