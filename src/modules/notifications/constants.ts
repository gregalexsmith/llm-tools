export enum DeviceType {
  WEB = "WEB",
}

export type DeviceTypes = keyof typeof DeviceType;

export enum NotificationType {
  NEW_MESSAGE = "NEW_MESSAGE",
}

export type NotificationTypes = keyof typeof NotificationType;
