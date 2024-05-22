# build & deploy 포팅 메뉴얼
## A. 사용한 JVM, WAS 제품 등의 종류와 설정 값, 버전(IDE버전 포함) 기재
- JVM: jdk 17
- WAS: Tomcat
- Web Server: Nginx(1.18.0 (Ubuntu))
- IDE
  - Front-end: VScode(1.8x)
  - Back-end: Intellij IDEA (2023.3.6)

## B. 빌드 시 사용되는 환경변수 등의 내용 상세 기재
### Spring application.yml
```
spring:
  application:
    name: coa

  datasource:
    username: root
    url: jdbc:mysql://k10e101.p.ssafy.io:3306/CoA
    password: CoAdev101
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: update
    # show-sql: true
    properties:
      hibernate:
        format_sql: 'true'

  data:
    redis:
      host: k10e101.p.ssafy.io
      port: 6379
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: 765601865422-gfbpej2d4oequfvi35v14j6cba5iafvr.apps.googleusercontent.com
            client-secret: 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
            redirect-uri: "{baseUrl}/login/oauth2/code/{registrationId}"
            scope:
              - email
              - profile
          kakao:
            client-id: 41aa62dd705f7bfe75d525de546caba9
            authorization-grant-type: authorization_code
            redirect-uri: "{baseUrl}/login/oauth2/code/{registrationId}"
            scope: profile_nickname, profile_image
            client-name: Kakao
          github:
            client-id: 2236801168f9b21564ac
            client-secret: 5af1b1f2fb95657ff633e84fb58bda34865fabe2
            redirect-uri: "{baseUrl}/login/oauth2/code/{registrationId}"
            scope:
              - read:user
              - user:email
          gitlab:
            client-id: a8767c8e70e1876877566fb57e10c0a115338c0aa8addcac9fcd2410c66dbb64
            client-secret: gloas-26c97aeb2e5f68f42cc0e7f28ba56f26b8a965579a0da17e9b12e1be7b1b8a44
            authorization-grant-type: authorization_code
            redirect-uri: "{baseUrl}/login/oauth2/code/{registrationId}"
            scope: profile,email,read_user
            client-name: GitLab
        provider:
          kakao:
            authorization-uri: https://kauth.kakao.com/oauth/authorize
            token-uri: https://kauth.kakao.com/oauth/token
            user-info-uri: https://kapi.kakao.com/v2/user/me
            user-name-attribute: id
          gitlab:
            authorization-uri: https://lab.ssafy.com/oauth/authorize
            token-uri: https://lab.ssafy.com/oauth/token
            user-info-uri: https://lab.ssafy.com/api/v4/user
            user-name-attribute: username

server:
  port: 8080

app:
  jwt:
    secret: dev101CoABuk2024CoABuk2024dev101abcdekouv3oij3huk3bmn2bmt2rxc1ils5owiejfosnzwefjshdofhwseifjsodicvsebfqhwgzxnvlksmewfefwefsdfwevxdfawdqwdzsddev101CoABuk2024dev101CoABuk2024dev101CoABuk2024dev101CoABuk2024dev101CoABuk2024dev101CoABuk2024dev101CoABuk2024dev101CoABuk2024dev101CoABuk2024dev101CoABuk2024
    expiration-ms: 7200 # 2 * 60 * 60L;
  encryption-key: sleifj3iejfa5wej91aw67efwefuz2mk9i3jiknujwq

springdoc:
  swagger-ui:
    path: /api/swagger-ui.html

url:
  ai: http://172.17.0.4:7777
  gitHubApi: https://api.github.com

  
```

### C. 배포 시 특이사항 기재

- Nginx를 활용해 리버스 프록시 구성
- publish over ssh를 활용해 빌드 후 SSH를 통해 원격 서버 배포 구현
- Jenkins를 활용한 CI/CD 구현

### D. DB 접속 정보 등 프로젝트(ERD)에 활용되는 주요 계정 및 프로퍼티가 정의된 파일 목록

- 3306 포트로 mysql DB연결
- 6379 포트로 redis 연결
- 구글, 카카오, GitHub, GitLab 로그인

### E. Nginx sites-available
/etc/nginx/sites-available/default 파일을 다음과 같이 수정
```
server {
    root /var/www/html;
    # Add index.php to the list if you are using PHP
    index index.html index.htm index.nginx-debian.html;
    #server_name _;
    server_name commitanalyze.com www.commitanalyze.com;
    
    listen [::]:443 ssl; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/commitanalyze.com/fullchain.pem; # managed by Certbot    ssl_certificate_key /etc/letsencrypt/live/commitanalyze.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot

    # 디테일한 에러 로그 찍기
    error_log  /var/log/nginx/error.log notice;


    location / {
        # 모든 비-API 요청을 3000 포트로 리디렉션
        proxy_pass http://commitanalyze.com:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        # /api 경로의 요청을 8080 포트로 리디렉션
        proxy_pass http://commitanalyze.com:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /oauth2 {
        # /api 경로의 요청을 8080 포트로 리디렉션
        proxy_pass http://commitanalyze.com:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /login {
        # /api 경로의 요청을 8080 포트로 리디렉션
        proxy_pass http://commitanalyze.com:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}


server {
    if ($host = www.commitanalyze.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    if ($host = commitanalyze.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


        listen 80 default_server;
        listen [::]:80 default_server;
        server_name commitanalyze.com www.commitanalyze.com;
    return 404; # managed by Certbot
}
```

