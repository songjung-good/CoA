package com.dev101.coa.domain.repo.service;

import com.dev101.coa.global.common.StatusCode;
import com.dev101.coa.global.exception.BaseException;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ExternalApiService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;



    public String fetchGithubReposSync(String userID, String accessToken) throws BaseException {
        return webClient.get()
                .uri("https://api.github.com/users/{userID}/repos", userID)
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .onStatus(status -> status.equals(HttpStatus.UNAUTHORIZED), response -> Mono.error(new BaseException(StatusCode.UNAUTHORIZED_API_ERROR)))
                .onStatus(status -> status.equals(HttpStatus.NOT_FOUND), response -> Mono.error(new BaseException(StatusCode.NOT_FOUND)))
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
                .onStatus(status -> status.equals(HttpStatus.NOT_FOUND), response -> Mono.error(new BaseException(StatusCode.NOT_FOUND)))
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
                .onStatus(status -> status.equals(HttpStatus.NOT_FOUND), response -> Mono.error(new BaseException(StatusCode.NOT_FOUND)))
                .onStatus(HttpStatusCode::is4xxClientError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Client error during GitHub repos fetching")))
                .onStatus(HttpStatusCode::is5xxServerError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Server error during GitHub repos fetching")))
                .bodyToMono(String.class)
                .block();

    }

    public String fetchGitlabProjects(String userName, String accessToken) {
        return webClient.get()
                .uri("https://lab.ssafy.com/api/v4/users/{userName}/projects", userName)
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .onStatus(status -> status.equals(HttpStatus.UNAUTHORIZED), response -> Mono.error(new BaseException(StatusCode.UNAUTHORIZED_API_ERROR)))
                .onStatus(status -> status.equals(HttpStatus.NOT_FOUND), response -> Mono.error(new BaseException(StatusCode.NOT_FOUND)))
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
                .onStatus(status -> status.equals(HttpStatus.NOT_FOUND), response -> Mono.error(new BaseException(StatusCode.NOT_FOUND)))
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
                .onStatus(status -> status.equals(HttpStatus.NOT_FOUND), response -> Mono.error(new BaseException(StatusCode.NOT_FOUND)))
                .onStatus(HttpStatusCode::is4xxClientError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Client error during GitHub events fetching 잔디")))
                .onStatus(HttpStatusCode::is5xxServerError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Server error during GitHub events fetching 잔디")))
                .bodyToMono(new ParameterizedTypeReference<>() {
                });  // 타입 참조를 사용하여 정확한 제네릭 타입 지정
    }


    public Mono<Map<String, Object>> fetchGitLabIssue(String userId, String accessToken) {
        Flux<Event> eventFlux = fetchAllUserCommits(userId, accessToken, 1);
        return aggregateContributions(eventFlux);
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
                .onStatus(status -> status.equals(HttpStatus.NOT_FOUND), response -> Mono.error(new BaseException(StatusCode.NOT_FOUND)))
                .onStatus(HttpStatusCode::is4xxClientError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Client error during GitLab events fetching 잔디")))
                .onStatus(HttpStatusCode::is5xxServerError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Server error during GitLab events fetching 잔디")))
                .bodyToFlux(Event.class)
                .concatMap(Mono::just);

    }
    public Mono<Map<String, Object>> aggregateContributions(Flux<Event> events) {
        return events
                .collectList()
                .map(list -> {
                    // 날짜 범위 결정
                    LocalDate startDay = list.stream()
                            .map(Event::getCreatedAt)
                            .filter(Objects::nonNull)
                            .map(date -> LocalDate.parse(date.substring(0, 10)))
                            .min(LocalDate::compareTo)
                            .orElse(LocalDate.now());

                    // 시작 해의 첫 날
                    LocalDate startDate = startDay.with(TemporalAdjusters.firstDayOfYear());

                    // 오늘 날짜 기준
                    LocalDate today = LocalDate.now();

                    // 오늘 날짜 기준으로 해당 연도의 마지막 날짜 계산
                    LocalDate endDate = today.with(TemporalAdjusters.lastDayOfYear());

                    // 모든 날짜에 대한 초기 맵 생성
                    Map<LocalDate, Long> allDates = Stream.iterate(startDate, date -> date.plusDays(1))
                            .limit(ChronoUnit.DAYS.between(startDate, endDate) + 1)
                            .collect(Collectors.toMap(date -> date, date -> 0L));

                    // 이벤트로부터 실제 값 집계
                    list.forEach(event -> {
                        LocalDate eventDate = LocalDate.parse(event.getCreatedAt().substring(0, 10));
                        allDates.merge(eventDate, 1L, Long::sum);
                    });

                    // 결과 맵 생성
                    Map<String, Object> result = new HashMap<>();
                    Map<String, Long> yearlyTotals = new HashMap<>();
                    List<Map<String, Object>> dailyContributions = new ArrayList<>();

                    allDates.forEach((date, count) -> {
                        yearlyTotals.merge(String.valueOf(date.getYear()), count, Long::sum);
                        Map<String, Object> daily = new HashMap<>();
                        daily.put("date", date.toString());
                        daily.put("count", count);
                        daily.put("level", determineLevel(count));
                        dailyContributions.add(daily);
                    });
                    // dailyContributions 정렬 (year 내림차순, month-day 오름차순)
                    dailyContributions.sort(Comparator.comparing((Map<String, Object> map) -> LocalDate.parse((String) map.get("date")).getYear())
                            .reversed()
                            .thenComparing(map -> LocalDate.parse((String) map.get("date")).getMonthValue())
                            .thenComparing(map -> LocalDate.parse((String) map.get("date")).getDayOfMonth()));

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
        else if (count <= 5) return 1;
        else if (count <= 10) return 2;
        else return 3;
    }


    public Mono<List<Map<String, Object>>> fetchGitHubContributions(String username, String accessToken) {
        return fetchRepositories(username, accessToken)
                .flatMapMany(Flux::fromIterable)
                .flatMap(repo -> {
                    String repoName = (String) repo.get("name");
                    return fetchAllCommits(repoName, username, accessToken)
                            .flatMapMany(Flux::fromIterable)
                            .flatMap(commit -> {
                                String commitSha = (String) commit.get("sha");
                                return fetchCommitFiles(repoName, commitSha, username, accessToken)
                                        .flatMapMany(Flux::fromIterable);
                            })
                            .collectList()
                            .map(files -> calculateLinesOfCode(repo, files));
                })
                .collectList();
    }

    private Mono<List<Map<String, Object>>> fetchRepositories(String username, String accessToken) {
        return webClient.get()
                .uri("https://api.github.com/users/{username}/repos", username)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .onStatus(status -> status.equals(HttpStatus.UNAUTHORIZED), response -> Mono.error(new BaseException(StatusCode.UNAUTHORIZED_API_ERROR)))
                .onStatus(status -> status.equals(HttpStatus.NOT_FOUND), response -> Mono.error(new BaseException(StatusCode.NOT_FOUND)))
                .onStatus(HttpStatusCode::is4xxClientError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Client error during GitHub events fetching 잔디")))
                .onStatus(HttpStatusCode::is5xxServerError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Server error during GitHub events fetching 잔디")))
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .timeout(Duration.ofSeconds(10))
                .onErrorResume(WebClientResponseException.class, e -> Mono.empty());
    }

    private Mono<List<Map<String, Object>>> fetchAllCommits(String repoName, String username, String accessToken) {
        return fetchCommits(repoName, username, accessToken, 1, new ArrayList<>());
    }

    private Mono<List<Map<String, Object>>> fetchCommits(String repoName, String username, String accessToken, int page, List<Map<String, Object>> accumulatedCommits) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")
                        .host("api.github.com")
                        .path("/repos/{username}/{repoName}/commits")
                        .queryParam("per_page", 100)
                        .queryParam("page", page)
                        .build(username, repoName))
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .onStatus(status -> status.equals(HttpStatus.UNAUTHORIZED), response -> Mono.error(new BaseException(StatusCode.UNAUTHORIZED_API_ERROR)))
                .onStatus(status -> status.equals(HttpStatus.NOT_FOUND), response -> Mono.error(new BaseException(StatusCode.NOT_FOUND)))
                .onStatus(HttpStatusCode::is4xxClientError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Client error during GitHub events fetching 잔디")))
                .onStatus(HttpStatusCode::is5xxServerError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Server error during GitHub events fetching 잔디")))
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .timeout(Duration.ofSeconds(10))
                .flatMap(commits -> {
                    if (commits == null || commits.isEmpty()) {
                        return Mono.just(accumulatedCommits);
                    } else {
                        accumulatedCommits.addAll(commits);
                        return fetchCommits(repoName, username, accessToken, page + 1, accumulatedCommits);
                    }
                })
                .onErrorResume(WebClientResponseException.class, e -> Mono.just(accumulatedCommits));
    }

    private Mono<List<Map<String, Object>>> fetchCommitFiles(String repoName, String commitSha, String username, String accessToken) {
        return webClient.get()
                .uri("https://api.github.com/repos/{username}/{repoName}/commits/{commitSha}", username, repoName, commitSha)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .onStatus(status -> status.equals(HttpStatus.UNAUTHORIZED), response -> Mono.error(new BaseException(StatusCode.UNAUTHORIZED_API_ERROR)))
                .onStatus(status -> status.equals(HttpStatus.NOT_FOUND), response -> Mono.error(new BaseException(StatusCode.NOT_FOUND)))
                .onStatus(HttpStatusCode::is4xxClientError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Client error during GitHub events fetching 잔디")))
                .onStatus(HttpStatusCode::is5xxServerError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "Server error during GitHub events fetching 잔디")))
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .map(response -> (List<Map<String, Object>>) response.get("files"))
                .timeout(Duration.ofSeconds(10))
                .onErrorResume(WebClientResponseException.class, e -> Mono.empty());
    }

    private Map<String, Object> calculateLinesOfCode(Map<String, Object> repo, List<Map<String, Object>> files) {
        Map<String, Integer> languageLineCounts = new HashMap<>();
        int totalLinesOfCode = 0;

        for (Map<String, Object> file : files) {
            String filePath = (String) file.get("filename");
            String language = getLanguageFromFilePath(filePath);

            Integer additions = (Integer) file.get("additions");

            if (language != null) {
                languageLineCounts.put(language, languageLineCounts.getOrDefault(language, 0) + (additions != null ? additions : 0));
                totalLinesOfCode += (additions != null ? additions : 0);
            }
        }

        Map<String, Object> projectData = new HashMap<>();
        projectData.put("name", repo.get("name"));
        projectData.put("createdAt", repo.get("created_at"));
        projectData.put("pushedAt", repo.get("pushed_at"));
        projectData.put("updatedAt", repo.get("updated_at"));
        projectData.put("languages", languageLineCounts);
        projectData.put("totalLinesOfCode", totalLinesOfCode);

        return projectData;
    }

    private String getLanguageFromFilePath(String filePath) {
        if (filePath == null || !filePath.contains(".")) {
            return null;
        }
        String extension = filePath.substring(filePath.lastIndexOf('.') + 1).toLowerCase();
        return switch (extension) {
            case "java" -> "Java";
            case "js" -> "JavaScript";
            case "py" -> "Python";
            case "html" -> "HTML";
            case "css" -> "CSS";
            case "sql" -> "SQL";
            case "cs" -> "C#";
            case "c" -> "C";
            case "cpp", "cxx", "cc", "h" -> "C++";
            case "ts" -> "TypeScript";
            case "php" -> "PHP";
            case "swift" -> "Swift";
            case "kt" -> "Kotlin";
            case "rb" -> "Ruby";
            case "go" -> "Go";
            case "rs" -> "Rust";
            case "dart" -> "Dart";
            case "r" -> "R";
            case "scala" -> "Scala";
            case "pl" -> "Perl";
            case "lua" -> "Lua";
            default -> null;
        };
    }

}
