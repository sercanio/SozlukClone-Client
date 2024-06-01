import { create } from 'zustand';

interface Notification {
  id: number;
  title: string;
  message: string;
}

const useNotificationStore = create((set) => ({
  notifications: [] as Notification[],
  notificationId: 0,

  showNotification: (title: string, message: string) =>
    set((state) => {
      const newId = state.notificationId + 1;
      const notifications = [...state.notifications, { id: newId, title, message }];
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((notification) => notification.id !== newId),
        }));
      }, 3000); // Adjust the autoClose time as needed
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
