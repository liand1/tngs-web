# 构建阶段
FROM node:20.11.1-alpine AS build
# 可以通过docker build --build-arg ENV=production来覆盖此默认值
ARG ENV=loc
ENV ENV=${ENV}

WORKDIR /app

COPY package*.json ./
# 如有 pnpm/yarn.lock 可一并 COPY
# COPY pnpm-lock.yaml ./
# COPY yarn.lock ./
RUN npm config set registry https://registry.npmmirror.com/

RUN npm install -g pnpm

RUN pnpm config set registry https://registry.npmmirror.com/
RUN pnpm install

COPY . .

RUN pnpm build:${ENV}

# 生产环境阶段
FROM nginx:alpine
ARG ENV=loc
ENV ENV=${ENV}

COPY --from=build /app/dist /usr/share/nginx/html

COPY /public /usr/share/nginx/html/public

# 启用自定义 nginx 配置
COPY nginx.${ENV}.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
# 安装 envsubst 命令（gettext 包）
# RUN apk add gettext

RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
# CMD ["nginx", "-g", "daemon off;"] 

# docker build -t tngx-web:1.0.0 -t tngx-web:1.0.0 .

# docker run -d -p 8088:80 --name tngx-web-container tngx-web:1.0.0