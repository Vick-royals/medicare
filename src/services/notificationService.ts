import api from "./api";

export interface Notification {
  _id: string;
  user: string;
  type: "reminder" | "taken" | "lowstock" | "appointment" | "tip";
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export const notificationService = {
  async getNotifications(): Promise<{ success: boolean; data: Notification[] }> {
    const res = await api.get("/notifications");
    return res.data;
  },

  async markRead(id: string): Promise<{ success: boolean; data: Notification }> {
    const res = await api.put(`/notifications/${id}/read`);
    return res.data;
  },

  async markAllRead(): Promise<{ success: boolean; message: string }> {
    const res = await api.put("/notifications/read-all");
    return res.data;
  },
};
