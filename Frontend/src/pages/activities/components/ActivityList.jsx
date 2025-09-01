import { Box, Typography } from "@mui/material";
import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import ActivityCard from "./ActivityCard";
import { API_AGENT } from "../../../network/api";
import PullToRefresh from "react-pull-to-refresh";

const ActivityList = forwardRef((props, ref) => {
  const [activityList, setActivityList] = useState([]);

  const getActivities = () => {
    API_AGENT.Activities.getActivities()
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          setActivityList(res?.data || []);
        }
      })
      .catch((err) => {
        console.error("Error fetching activities:", err);
      });
  };

  // Expose the `getActivities` function to the parent component
  useImperativeHandle(ref, () => ({
    getActivities,
  }));

  useEffect(() => {
    getActivities();
  }, []);

  return (
    <PullToRefresh
      onRefresh={getActivities}
      style={{ height: "100%", overflow: "auto",width: "70%", padding: "0px 5px" }}
    >
      <Box width={"100%"} mx="auto">
        {activityList.length > 0 ? (
          activityList.map((activity, index) => (
            <Box paddingBottom={2} key={index}>
              <ActivityCard data={activity} />
            </Box>
          ))
        ) : (
          <Typography variant="h6" align="center" color="textSecondary">
            No activities found. Pull to refresh.
          </Typography>
        )}
      </Box>
    </PullToRefresh>
  );
});

export default ActivityList;