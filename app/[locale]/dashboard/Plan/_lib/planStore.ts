import { create } from 'zustand';
import { 
  Plan, 
  updatePlanStatus, 
  createPlan, 
  deletePlanApi,
  updatePlanText 
} from '@/lib/actions/plans';

interface PlanState {
  plans: Plan[];
  isSyncing: boolean; 
  setPlans: (plans: Plan[]) => void;
  togglePlan: (planId: string) => Promise<void>;
  addPlan: (title: string, time: string, target_date: string) => Promise<void>; 
  deletePlan: (planId: string) => Promise<void>;
  editPlan: (planId: string, title: string, time: string) => Promise<void>;
}

export const usePlanStore = create<PlanState>()((set, get) => ({
  plans: [],
  isSyncing: false,

  setPlans: (plans) => {
    if (!get().isSyncing) {
      set({ plans });
    }
  },

  togglePlan: async (planId) => {
    const previousPlans = get().plans;
    const plan = previousPlans.find(p => p.id === planId);
    if (!plan) return;

    const newStatus = !plan.completed;

    set({ 
      isSyncing: true,
      plans: previousPlans.map(p => 
        p.id === planId ? { ...p, completed: newStatus } : p
      )
    });

    try {
      const { error } = await updatePlanStatus(planId, newStatus);
      if (error) throw error;
    } catch (error) {
      console.error("Toggle failed, rolling back:", error);
      set({ plans: previousPlans }); 
    } finally {
      set({ isSyncing: false });
    }
  },

  addPlan: async (title, time, target_date) => {
    set({ isSyncing: true });
    
    try {
      const { data, error } = await createPlan(title, time, target_date);
      if (error) throw error;
      if (data) {
        set({ plans: [...get().plans, data] });
      }
    } catch (error) {
      console.error("Add failed:", error);
    } finally {
      set({ isSyncing: false });
    }
  },

  deletePlan: async (planId) => {
    const previousPlans = get().plans;
    
    set({ 
      isSyncing: true,
      plans: previousPlans.filter(p => p.id !== planId) 
    });

    try {
      const { error } = await deletePlanApi(planId);
      if (error) throw error;
    } catch (error) {
      console.error("Delete failed, rolling back:", error);
      set({ plans: previousPlans }); 
    } finally {
      set({ isSyncing: false });
    }
  },

  editPlan: async (planId, title, time) => {
    const previousPlans = get().plans;
    set({ isSyncing: true });

    set({
      plans: previousPlans.map((p: Plan) => 
        p.id === planId ? { ...p, title, time } : p
      )
    });

    try {
      const { error } = await updatePlanText(planId, title, time);
      if (error) throw error;
    } catch (error) {
      console.error("Edit failed, rolling back:", error);
      set({ plans: previousPlans }); 
    } finally {
      set({ isSyncing: false });
    }
  }
}));