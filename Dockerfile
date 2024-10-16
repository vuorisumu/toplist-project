## Frontend
FROM node:20.9.0-alpine as frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend .

RUN npm run build

## Backend
FROM oraclelinux:8

RUN curl -sL https://rpm.nodesource.com/setup_20.x | bash - && \
    yum install -y nodejs && \
    yum install -y oracle-release-el8 oracle-instantclient-release-el8 && \
    yum install -y oracle-instantclient-basic && \
    yum clean all

WORKDIR /app/backend

COPY backend/package*.json ./

RUN npm install

COPY backend .

COPY --from=frontend-builder /app/frontend/dist /app/backend/frontend/dist

EXPOSE 3000

CMD ["npm", "start"]