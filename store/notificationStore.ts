import { create } from 'zustand';

export type Variant = 'info' | 'success' | 'error' | 'warning';

type TNotification = {
  id: number;
  title: string;
  message: string;
  variant: Variant;
};

export type TNotificationProps = {
  title: string;
  message: string;
  variant: Variant;
};

interface TNotificationState {
  notifications: TNotification[];
  notificationId: number;
  showNotification: ({ title, message, variant }: TNotificationProps) => void;
  hideNotification: (id: number) => void;
}

const useNotificationStore = create<TNotificationState>((set) => ({
  notifications: [] as TNotification[],
  notificationId: 0,

  showNotification: ({ title, message, variant }: TNotificationProps) =>
    set((state) => {
      const newId = state.notificationId + 1;
      const notifications = [...state.notifications, { id: newId, title, message, variant }];
      setTimeout(() => {
        set((stateOnTimeOut) => ({
          notifications: stateOnTimeOut.notifications.filter(
            (notification) => notification.id !== newId
          ),
        }));
      }, 3000);
      return {
        notifications,
        notificationId: newId,
      };
    }),

  hideNotification: (id: number) =>
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id),
    })),
}));

export default useNotificationStore;
