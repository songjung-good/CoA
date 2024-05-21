## 개발환경
```
node : v20.12.2 (LTS)

next : 14.2.2 웹 개발 프레임워크

react : 18 웹 개발 라이브러리

prettier : 3.2.5 코드포맷터

zustand : 4.5.2 전역상태관리

axios: 1.6.8

tailwind-styled-components : 2.2.0

styled-components : 6.1.8

d3 : 7.9.0 데이터 시각화 라이브러리

uiw/react-md-editor: 3.6.0 markdown편집기
```

## Dockerfile
```
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
```

## 도커 이미지 생성 (fe/root directory)
```
cd next-front/fe && docker build -t coa-next:latest .
```

## 도커 컨테이너 실행
```
docker run --name coa-next -d -p 3000:3000 coa-next:latest
```
