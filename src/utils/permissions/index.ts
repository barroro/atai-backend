export const PERMISSIONS = {
  SHOW_USERS: "Show.users",
  UPDATE_USER: "Update.user",
  CREATE_USER: "Create.user",
  DELETE_USER: "Delete.user",
  SHOW_ROLES: "Show.roles",
  UPDATE_ROLE: "Update.role",
  CREATE_ROLE: "Create.role",
  DELETE_ROLE: "Delete.role",
};

export type IPermission = keyof typeof PERMISSIONS;
