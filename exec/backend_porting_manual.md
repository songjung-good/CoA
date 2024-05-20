# ubuntu에 docker, docker-compose 설치하기
### 참고 : https://docs.docker.com/engine/install/ubuntu/
1. 충돌하는 모든 패키지 제거
```
   for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
```
1. docker apt repository 설정
```
# Add Docker's official GPG key:
sudo apt-get update
	# ca-certificates와 curl 설치(ca-certificates: SSL기반 어플리케이션이 SSL연결의 인증을 확인할 수 있도록 도움, curl: URL을 통한 데이터 전송에 사용)
sudo apt-get install ca-certificates curl 
	# curl을 사용해 docker의 공식 GPG키를 다운받고 /etc/apt/keyrings/docker.asc에 저장
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
	# 패키지 매니저가 패키지 검증을 할 수 있도록 GPG키 파일을 누구나 읽을 수 있도록 권한 변경
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```
3. docker 패키지 설치
```
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```
4. docker compose 설치
```
   sudo apt-get update
sudo apt-get install docker-compose-plugin
# 설치 확인
docker compose version
```

# docker compose 파일 작성
```
services:
  redis:
    image: redis:latest
    container_name: redis
    ports:
      - "6379:6379"

  mysql:
    image: mysql:latest
    container_name: mysql
    environment:
      MYSQL_ROOT_PASSWORD: CoAdev101
    ports:
      - "3306:3306"

  jenkins:
    image: jenkins/jenkins:lts
    container_name: jenkins
    environment:
      JENKINS_OPTS: "--httpPort=7070"
    ports:
      - "7070:7070"
    volumes:
            - /home/ubuntu/jenkins_home:/var/jenkins_home
```

# docker compose 파일 실행
```
sudo docker compose up -d # -d옵션은 백그라운드 실행
```

# 스프링 도커 파일
```
# 기본 이미지 설정
FROM openjdk:17-jdk

# 컨테이너 내의 작업 디렉토리 설정
WORKDIR /app

# 호스트의 빌드된 JAR 파일을 컨테이너로 복사
COPY coa-0.0.1-SNAPSHOT.jar app.jar

# 애플리케이션 포트 설정 (애플리케이션에 맞게 수정하세요)
EXPOSE 8080

# 애플리케이션 실행 명령어 설정
CMD ["java", "-jar", "app.jar"]
```

# 스프링 컨테이너 띄우기
```
'docker run --name coa-spring -d -p 8080:8080 coa-spring:latest'
```
