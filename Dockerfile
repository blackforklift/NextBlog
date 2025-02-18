#dev
FROM node


WORKDIR /app/
COPY package.json package-lock.json ./
RUN npm install --omit=dev
COPY . .
RUN npx prisma generate
RUN npx prisma db push
RUN npm run build

ENV NODE_ENV=development


CMD ["npm", "start"]