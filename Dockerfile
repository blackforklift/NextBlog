#dev
FROM node


WORKDIR /app/
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npx prisma db push

ENV NODE_ENV=development


CMD ["npm", "run", "dev"]