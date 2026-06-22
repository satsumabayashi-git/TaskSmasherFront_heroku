# 本番環境
# ビルドステージ
FROM node:22-alpine AS builder
WORKDIR /app
COPY ./package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 実行ステージ
FROM nginx:1.25-alpine AS runner
# デフォルトの設定ファイルを削除
RUN rm /etc/nginx/conf.d/default.conf
# RUN rm /etc/nginx/nginx.conf
# カスタム設定ファイルをコンテナ内にコピー
COPY default.conf /etc/nginx/conf.d
# COPY nginx.conf /etc/nginx
# Build Stageで作った成果物（/app/build）だけをコピー
# ソースコードやnode_modulesはここには含まれない
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]




# # 開発環境
# FROM node:22-alpine
# WORKDIR /app
# COPY ./TaskSmasherFront/package*.json ./
# RUN npm install
# COPY ./TaskSmasherFront/ .
# EXPOSE 5173
# CMD ["npm", "run", "dev"]