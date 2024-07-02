export const assignmentStateEnum = {
  0: "Accepted",
  1: "Waiting for acceptance",
  2: "Declined",
};

export const getAssignmentState = (stateName) => {
  return parseInt(Object.keys(assignmentStateEnum).find(key => assignmentStateEnum[key] === stateName), 10);
};