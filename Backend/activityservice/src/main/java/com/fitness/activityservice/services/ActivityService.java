package com.fitness.activityservice.services;

import com.fitness.activityservice.ActivityRepository;
import com.fitness.activityservice.Dto.ActivityRequest;
import com.fitness.activityservice.Dto.ActivityResponse;
import com.fitness.activityservice.model.Activity;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserValidationService userValidationService;
    private final RabbitTemplate rabbitTemplate;

    @Value("${spring.rabbitmq.exchange.name}")
    private String exchange;

    @Value("${spring.rabbitmq.exchange.routing}")
    private String routingKey;

    public ActivityResponse trackActivity(ActivityRequest activityRequest) {
        Boolean isUserExist = userValidationService.validateUser(activityRequest.getUserId());
        if(!isUserExist){
            throw new RuntimeException("User does not exist");
        }
        Activity activity = Activity.builder()
                .userId(activityRequest.getUserId())
                .type(activityRequest.getType())
                .duration(activityRequest.getDuration())
                .caloriesBurned(activityRequest.getCaloriesBurned())
                .startTime(activityRequest.getStartTime())
                .additionalMetrics(activityRequest.getAdditionalMetrics())
                .build();

        Activity savedActivity = activityRepository.save(activity);

        try{
            rabbitTemplate.convertAndSend(exchange,routingKey,savedActivity);
        }catch (Exception e){
            log.error( "Failed to publish activity to RabbitMQ" + e.getMessage());
        }

        return  mapToResponse(savedActivity);
    }

    private ActivityResponse mapToResponse(Activity activity) {
        ActivityResponse activityResponse = new ActivityResponse();
        activityResponse.setId(activity.getId());
        activityResponse.setType(activity.getType());
        activityResponse.setDuration(activity.getDuration());
        activityResponse.setCaloriesBurned(activity.getCaloriesBurned());
        activityResponse.setStartTime(activity.getStartTime());
        activityResponse.setAdditionalMetrics(activity.getAdditionalMetrics());
        activityResponse.setCreatedAt(activity.getCreatedAt());
        activityResponse.setUpdatedTime(activity.getUpdatedTime());
        activityResponse.setUserId(activity.getUserId());
        return activityResponse;
    }

    public List<ActivityResponse> getUserActivities(String userId) {
        List<Activity> allActivity = activityRepository.findByUserId(userId);
        return allActivity.stream().map(this::mapToResponse).collect(Collectors.toList());


    }

    public Optional<ActivityResponse> getActivity(String activityId) {
        Optional<Activity> optionalActivity = activityRepository.findById(activityId);
        if(optionalActivity.isPresent()){
            return Optional.of(mapToResponse(optionalActivity.get()));
        }else{
            return Optional.empty();
        }
    }
}
