const activityLog = [];

export const logActivity = (user, action, details) => {
  activityLog.push({
    user: user.username,
    role: user.role,
    action,
    details,
    timestamp: new Date(),
  });
};

export const getActivityLog = () => {
  return activityLog;
};
