package com.fitness.gateway.user;

import com.fitness.gateway.RegisterRequest;
import com.fitness.gateway.UserResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final WebClient userServiceWebClient;

    public Mono<Boolean> validateUser(String userId){
        log.info("[Activity service] Calling user validation API for user id " + userId);
            return userServiceWebClient.get().uri("/api/users/{userId}/validate",userId)
                    .retrieve()
                    .bodyToMono(Boolean.class)
                    .onErrorResume(WebClientResponseException.class, e -> {
                        if(e.getStatusCode() == HttpStatus.NOT_FOUND){
                            return Mono.error(new RuntimeException("User not found" + userId));
                        }else if(e.getStatusCode() == HttpStatus.BAD_REQUEST){
                            return Mono.error(new RuntimeException("Bad request" + userId));
                        }
                        return Mono.error(new RuntimeException("Unexpected error" + userId));
                    });
    }

    public Mono<UserResponse> registerUser(RegisterRequest registerRequest){
        log.info("[gateway service] Calling user registration API for user id ]");
        return userServiceWebClient.post()
                .uri("/api/users/register")
                .bodyValue(registerRequest)
                .retrieve()
                .bodyToMono(UserResponse.class)
                .onErrorResume(WebClientResponseException.class, e -> {
                    if(e.getStatusCode() == HttpStatus.NOT_FOUND){
                        return Mono.error(new RuntimeException("User not found" + registerRequest.getEmail()));
                    }else if(e.getStatusCode() == HttpStatus.BAD_REQUEST){
                        return Mono.error(new RuntimeException("Invalid request" + registerRequest.getEmail()));
                    }
                    return Mono.error(new RuntimeException("Unexpected error" + registerRequest.getEmail()));
                });
    }

}
