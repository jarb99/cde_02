enum ChangeType {
  NoChange = "NoChange",
  Added    = "Added",
  Edited   = "Edited",
  Deleted  = "Deleted",
}

interface ChangeTracking {
  change: ChangeType;
}

export { ChangeType };
export default ChangeTracking;