import api from "./api";

export interface AdherenceHistory {
  _id: string;
  user: string;
  medication?: string;
  date: string;
  status: "taken" | "missed" | "snoozed" | "nodata";
  createdAt: string;
  updatedAt: string;
}

export interface AdherenceSummary {
  adherenceRate: number;
  taken: number;
  missed: number;
  snoozed: number;
  total: number;
}

export const adherenceService = {
  async getHistory(startDate?: string, endDate?: string): Promise<{ success: boolean; data: AdherenceHistory[] }> {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    const res = await api.get(`/adherence?${params.toString()}`);
    return res.data;
  },

  async getSummary(month?: number, year?: number): Promise<{ success: boolean; data: AdherenceSummary }> {
    const params = new URLSearchParams();
    if (month !== undefined) params.append("month", month.toString());
    if (year !== undefined) params.append("year", year.toString());
    const res = await api.get(`/adherence/summary?${params.toString()}`);
    return res.data;
  },

  async logAdherence(data: { medicationId?: string; date: string; status: string }): Promise<{ success: boolean; data: AdherenceHistory }> {
    const res = await api.post("/adherence", data);
    return res.data;
  },
};
