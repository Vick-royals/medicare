import api from "./api";

export interface Consultation {
  _id: string;
  name: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  slots?: number;
  type: "Physical Visit" | "Virtual Visit";
  typeColor: string;
  avatar?: string;
  user?: string;
  status?: "Available" | "Confirmed" | "Completed" | "Cancelled";
  statusColor?: string;
  createdAt: string;
  updatedAt: string;
}

export const consultationService = {
  async getAvailable(): Promise<{ success: boolean; data: Consultation[] }> {
    const res = await api.get("/consultations/available");
    return res.data;
  },

  async getMy(): Promise<{ success: boolean; data: Consultation[] }> {
    const res = await api.get("/consultations/my");
    return res.data;
  },

  async getPast(): Promise<{ success: boolean; data: Consultation[] }> {
    const res = await api.get("/consultations/past");
    return res.data;
  },

  async book(id: string): Promise<{ success: boolean; data: Consultation }> {
    const res = await api.post(`/consultations/${id}/book`);
    return res.data;
  },

  async reschedule(id: string, date: string, time: string): Promise<{ success: boolean; data: Consultation }> {
    const res = await api.put(`/consultations/${id}/reschedule`, { date, time });
    return res.data;
  },

  async cancel(id: string): Promise<{ success: boolean; data: Consultation }> {
    const res = await api.put(`/consultations/${id}/cancel`);
    return res.data;
  },
};
