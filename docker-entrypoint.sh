#!/bin/sh
set -e

# 测试 nginx 配置
nginx -t

echo "Nginx 配置检查通过，启动服务..."
exec nginx -g 'daemon off;'