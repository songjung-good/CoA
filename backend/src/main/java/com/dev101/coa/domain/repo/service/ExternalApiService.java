package com.dev101.coa.domain.repo.service;

import com.dev101.coa.global.common.StatusCode;
import com.dev101.coa.global.exception.BaseException;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExternalApiService {
    private static final Logger logger = LoggerFactory.getLogger(ExternalApiService.class);

    private final WebClient webClient;
    private final ObjectMapper objectMapper;



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
                .uri("https://lab.ssafy.com/api/v4/projects/{projectId}/members", projectId)
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .onStatus(status -> status.equals(HttpStatus.UNAUTHORIZED), response -> Mono.error(new BaseException(StatusCode.UNAUTHORIZED_API_ERROR)))
//TODO 잘못된 유저 정보 ( 유저닉네임 업데이트 됐을 때 )                .onStatus(status -> status.equals(HttpStatus.NOT_FOUND), response -> Mono.error(new BaseException(StatusCode.UNAUTHORIZED_API_ERROR)))
                .onStatus(HttpStatusCode::is4xxClientError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Client error during GitHub repos fetching")))
                .onStatus(HttpStatusCode::is5xxServerError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Server error during GitHub repos fetching")))
                .bodyToMono(String.class)
                .block();
    }

    public Mono<Map<String, Object>> fetchGithubIssue(String userId, String accessToken) {
        return webClient.get()
                .uri("https://github-contributions-api.jogruber.de/v4/{userId}", userId)
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .onStatus(status -> status.equals(HttpStatus.UNAUTHORIZED), response -> Mono.error(new BaseException(StatusCode.UNAUTHORIZED_API_ERROR)))
                .onStatus(HttpStatusCode::is4xxClientError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Client error during GitHub events fetching 잔디")))
                .onStatus(HttpStatusCode::is5xxServerError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Server error during GitHub events fetching 잔디")))
                .bodyToMono(new ParameterizedTypeReference<>() {
                });  // 타입 참조를 사용하여 정확한 제네릭 타입 지정
    }


    public Mono<Map<String, Object>> processUserEvents(String gitLabUserName, String gitLabAccessToken, String githubUserName, String githubAccessToken) {
        Mono<Map<String, Object>> githubMono = null;
        Mono<Map<String, Object>> gitlabMono = null;

        if (githubAccessToken != null) {
            githubMono = fetchGithubIssue(githubUserName, githubAccessToken);
        }
        if (gitLabAccessToken != null) {
            Flux<Event> eventsFlux = fetchAllUserCommits(gitLabUserName, gitLabAccessToken, 1);

            gitlabMono = aggregateContributions(eventsFlux);
        }

        return combineContributions(githubMono, gitlabMono);
    }

    public Flux<Event> fetchAllUserCommits(String userId, String accessToken, int page) {
        Flux<Event> currentFlux = fetchUserCommitsRecursive(userId, accessToken, page);

        return currentFlux.hasElements()
                .flatMapMany(hasElements -> {
                    if (hasElements) { // concatWith이 Flux에 이어서 진행시키는건가?
                        return currentFlux.concatWith(fetchAllUserCommits(userId, accessToken, page + 1));
                    } else {
                        return currentFlux;
                    }
                });
    }

    private Flux<Event> fetchUserCommitsRecursive(String userId, String accessToken, int page) {
        return webClient.get()
                .uri("https://lab.ssafy.com/api/v4/users/" + userId + "/events?action=pushed&per_page=100&page=" + page)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .onStatus(status -> status.equals(HttpStatus.UNAUTHORIZED), response -> Mono.error(new BaseException(StatusCode.UNAUTHORIZED_API_ERROR)))
                .onStatus(HttpStatusCode::is4xxClientError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Client error during GitLab events fetching 잔디")))
                .onStatus(HttpStatusCode::is5xxServerError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Server error during GitLab events fetching 잔디")))
                .bodyToFlux(Event.class)
                .concatMap(Mono::just);

    }
    public Mono<Map<String, Object>> aggregateContributions(Flux<Event> events) {
        return events
                .map(event -> {
                    String createdAt = event.getCreatedAt();
                    if (createdAt != null) {
                        return LocalDate.parse(createdAt.substring(0, 10));
                    }
                    return null;
                })
                .filter(Objects::nonNull)  // null 값을 제거
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()))
                .map(contributions -> {
                    Map<String, Object> result = new HashMap<>();
                    Map<String, Long> yearlyTotals = new HashMap<>();
                    List<Map<String, Object>> dailyContributions = new ArrayList<>();

                    contributions.forEach((date, count) -> {
                        yearlyTotals.merge(String.valueOf(date.getYear()), count, Long::sum);
                        Map<String, Object> daily = new HashMap<>();
                        daily.put("date", date.toString());
                        daily.put("count", count);
                        daily.put("level", determineLevel(count));
                        dailyContributions.add(daily);
                    });
                    result.put("total", yearlyTotals);
                    result.put("contributions", dailyContributions);
                    return result;
                });
    }
    @Getter
    @Setter
    public static class Event {
//        private String created_at;
        @JsonProperty("created_at") // 값이 들어오는 형태를 잡아내기 위해서 설정.
        private String createdAt;

    }
    private int determineLevel(long count) {
        if (count == 0) return 0;
        else if (count <= 2) return 1;
        else if (count <= 5) return 2;
        else return 3;
    }

    public Mono<Map<String, Object>> combineContributions(Mono<Map<String, Object>> githubMono, Mono<Map<String, Object>> gitLabMono) {
        return Mono.zip(githubMono, gitLabMono, (githubData, gitLabData) -> {
            Map<String, Object> result = new HashMap<>();

            // 연도별 총계 합치기
            Map<String, Object> githubRawTotal = (Map<String, Object>) githubData.get("total");
            Map<String, Object> gitLabRawTotal = (Map<String, Object>) gitLabData.get("total");

            Map<String, Long> githubTotal = convertToLongMap(githubRawTotal);
            Map<String, Long> gitLabTotal = convertToLongMap(gitLabRawTotal);

            Map<String, Long> totalContributions = new HashMap<>(githubTotal);
            gitLabTotal.forEach((key, value) -> {
                totalContributions.computeIfPresent(key, (k, v) -> v + value);
            });

            result.put("total", totalContributions);

            // 일별 컨트리뷰션 리스트 합치기
            List<Map<String, Object>> combinedContributions = mergeContributions(
                    (List<Map<String, Object>>) githubData.get("contributions"),
                    (List<Map<String, Object>>) gitLabData.get("contributions")
            );

            result.put("contributions", combinedContributions);

            return result;
        });
    }

    private Map<String, Long> convertToLongMap(Map<String, Object> original) {
        Map<String, Long> converted = new HashMap<>();
        for (Map.Entry<String, Object> entry : original.entrySet()) {
            Object value = entry.getValue();
            Long longValue = (value instanceof Integer) ? Long.valueOf((Integer) value) : (Long) value;
            converted.put(entry.getKey(), longValue);
        }
        return converted;
    }
    public List<Map<String, Object>> mergeContributions(List<Map<String, Object>> githubContributions, List<Map<String, Object>> gitLabContributions) {
        // 두 리스트를 결합
        List<Map<String, Object>> combined = new ArrayList<>();
        combined.addAll(githubContributions);
        combined.addAll(gitLabContributions);

        // 날짜별로 그룹화하고, count와 level을 합산
        Map<String, Map<String, Object>> groupedByDate = combined.stream()
                .collect(Collectors.groupingBy(
                        contribution -> (String) contribution.get("date"),
                        Collectors.reducing(new HashMap<String, Object>() {{
                            put("date", "");
                            put("count", 0);
                            put("level", 0);
                        }}, (a, b) -> {
                            Map<String, Object> merged = new HashMap<>();
                            merged.put("date", a.get("date"));
                            merged.put("count", (Integer) a.get("count") + (Integer) b.get("count"));
                            merged.put("level", (Integer) a.get("level") + (Integer) b.get("level"));
                            return merged;
                        })
                ));

        // 결과를 리스트로 변환
        return new ArrayList<>(groupedByDate.values());
    }
}
