package com.fitness.activityservice.controller;

import com.fitness.activityservice.Dto.ActivityRequest;
import com.fitness.activityservice.Dto.ActivityResponse;
import com.fitness.activityservice.model.Activity;
import com.fitness.activityservice.services.ActivityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/activity")
public class ActivityController {

    private ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @PostMapping
    public ResponseEntity<ActivityResponse> trackActivity(@RequestBody ActivityRequest req, @RequestHeader("X-User-ID") String userId){
        if(userId != null) {
            req.setUserId(userId);
        }
        return ResponseEntity.ok(activityService.trackActivity(req));
    }

    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getUserActivities( @RequestHeader("X-User-ID") String userId){
        return ResponseEntity.ok(activityService.getUserActivities(userId));
    }

    @GetMapping("/{activityId}")
    public ResponseEntity<ActivityResponse> getActivity(@PathVariable String activityId){
        Optional<ActivityResponse> activity = activityService.getActivity(activityId);
        if(activity.isPresent()){
            return ResponseEntity.ok(activity.get());
        }else{
            return ResponseEntity.notFound().build();
        }
    }

}
