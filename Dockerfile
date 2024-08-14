# ベースイメージとしてNode.jsを使用
FROM node:18

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

# ポート3000を公開
EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "start"]

# 環境変数を設定
ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV