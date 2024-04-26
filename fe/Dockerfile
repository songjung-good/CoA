# 기본 이미지 설정
FROM node:20.12.2-alpine

# 작업 디렉토리 설정
WORKDIR /fe

# 의존성 파일 복사
COPY package.json package-lock.json ./

# 의존성 설치
RUN npm i

# 소스 코드 복사
COPY . .

# 빌드
RUN npm run build

# 애플리케이션 시작 명령 설정
CMD ["npm", "run", "start"]