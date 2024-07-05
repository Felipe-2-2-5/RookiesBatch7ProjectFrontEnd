export const assignmentStateEnum = {
  0: "Accepted",
  1: "Declined",
  2: "Waiting for acceptance",
  3: "Waiting for returning",
};

export const getAssignmentState = (stateName) => {
  return parseInt(
    Object.keys(assignmentStateEnum).find(
      (key) => assignmentStateEnum[key] === stateName
    ),
    10
  );
};
