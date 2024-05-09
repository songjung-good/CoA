package com.dev101.coa.domain.repo.service;

import com.dev101.coa.global.common.StatusCode;
import com.dev101.coa.global.exception.BaseException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class ExternalApiService {

    private final WebClient webClient;


    public String fetchGithubReposSync(String userID, String accessToken) throws BaseException {
        return webClient.get()
                .uri("https://api.github.com/users/{userID}/repos", userID)
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .onStatus(status -> status.equals(HttpStatus.UNAUTHORIZED), response -> Mono.error(new BaseException(StatusCode.UNAUTHORIZED_API_ERROR)))
                .onStatus(HttpStatusCode::is4xxClientError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Client error during GitHub repos fetching")))
                .onStatus(HttpStatusCode::is5xxServerError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Server error during GitHub repos fetching")))
                .bodyToMono(String.class)
                .block();

    }

    public String fetchGitlabRepos(String userID, String accessToken) {
        return webClient.get()
                .uri("https://lab.ssafy.com/api/v4/users/{userID}/contributed_projects", userID)
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .onStatus(status -> status.equals(HttpStatus.UNAUTHORIZED), response -> Mono.error(new BaseException(StatusCode.UNAUTHORIZED_API_ERROR)))
                .onStatus(HttpStatusCode::is4xxClientError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Client error during GitHub repos fetching")))
                .onStatus(HttpStatusCode::is5xxServerError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Server error during GitHub repos fetching")))
                .bodyToMono(String.class)
                .block();

    }



    public String fetchGitHubMembers(String userName, String projectName, String accessToken) {
        return webClient.get()
                .uri("https://api.github.com/repos/{userName}/{projectName}/contributors", userName, projectName)
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .onStatus(status -> status.equals(HttpStatus.UNAUTHORIZED), response -> Mono.error(new BaseException(StatusCode.UNAUTHORIZED_API_ERROR)))
                .onStatus(HttpStatusCode::is4xxClientError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Client error during GitHub repos fetching")))
                .onStatus(HttpStatusCode::is5xxServerError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Server error during GitHub repos fetching")))
                .bodyToMono(String.class)
                .block();

    }

    public String fetchGitlabProjects(String userName, String accessToken) {
        return webClient.get()
                .uri("https://lab.ssafy.com/api/v4/projects/{userName}/users", userName)
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .onStatus(status -> status.equals(HttpStatus.UNAUTHORIZED), response -> Mono.error(new BaseException(StatusCode.UNAUTHORIZED_API_ERROR)))
                .onStatus(HttpStatusCode::is4xxClientError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Client error during GitHub repos fetching")))
                .onStatus(HttpStatusCode::is5xxServerError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Server error during GitHub repos fetching")))
                .bodyToMono(String.class)
                .block();
    }

    public String fetchGitlabMembers(String projectId, String accessToken) {
        return webClient.get()
                .uri("https://lab.ssafy.com/api/v4/projects/${projectId}/members", projectId)
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .onStatus(status -> status.equals(HttpStatus.UNAUTHORIZED), response -> Mono.error(new BaseException(StatusCode.UNAUTHORIZED_API_ERROR)))
                .onStatus(HttpStatusCode::is4xxClientError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Client error during GitHub repos fetching")))
                .onStatus(HttpStatusCode::is5xxServerError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Server error during GitHub repos fetching")))
                .bodyToMono(String.class)
                .block();
    }
}
