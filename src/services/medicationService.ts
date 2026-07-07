import api from "./api";

export interface Medication {
  _id: string;
  user: string;
  name: string;
  dose: string;
  instruction: string;
  frequency: string;
  route: string;
  remaining: number;
  status: "active" | "low" | "inactive";
  color: string;
  pillColor: string;
  createdAt: string;
  updatedAt: string;
}

export const medicationService = {
  async getMedications(): Promise<{ success: boolean; data: Medication[] }> {
    const res = await api.get("/medications");
    return res.data;
  },

  async createMedication(data: Omit<Medication, "_id" | "user" | "createdAt" | "updatedAt">): Promise<{ success: boolean; data: Medication }> {
    const res = await api.post("/medications", data);
    return res.data;
  },

  async updateMedication(id: string, data: Partial<Medication>): Promise<{ success: boolean; data: Medication }> {
    const res = await api.put(`/medications/${id}`, data);
    return res.data;
  },

  async deleteMedication(id: string): Promise<{ success: boolean; message: string }> {
    const res = await api.delete(`/medications/${id}`);
    return res.data;
  },
};
