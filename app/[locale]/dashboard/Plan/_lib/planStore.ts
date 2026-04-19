import { create } from 'zustand';
import { Plan, updatePlanStatus, createPlan, deletePlanApi } from '@/lib/actions/plans';

interface PlanState {
  plans: Plan[];
  setPlans: (plans: Plan[]) => void;
  togglePlan: (planId: string) => Promise<void>;
  addPlan: (title: string, time: string, target_date: string) => Promise<void>; 
  deletePlan: (planId: string) => Promise<void>;
}

export const usePlanStore = create<PlanState>()((set, get) => ({
  plans: [],
  setPlans: (plans) => set({ plans }),
  
  getPlansByDate: (date: string) => {
    return get().plans.filter(p => p.target_date === date);
  }, 

  togglePlan: async (planId) => {
    const currentPlans = get().plans;
    const plan = currentPlans.find(p => p.id === planId);
    if (!plan) return;

    const newStatus = !plan.completed;
    set({
      plans: currentPlans.map(p => p.id === planId ? { ...p, completed: newStatus } : p)
    });

    await updatePlanStatus(planId, newStatus);
  },

  addPlan: async (title: string, time: string, target_date: string) => {
    const { data } = await createPlan(title, time, target_date);
    if (data) set({ plans: [...get().plans, data] });
  },

  deletePlan: async (planId) => {
    const currentPlans = get().plans;
    set({ plans: currentPlans.filter(p => p.id !== planId) });
    await deletePlanApi(planId);
  }
}));