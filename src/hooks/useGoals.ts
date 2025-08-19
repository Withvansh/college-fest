
import { useState, useEffect } from 'react';
import { goalsApi, type Goal } from '@/lib/api/goals';
import { toast } from 'sonner';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await goalsApi.getGoals();
      setGoals(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch goals';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goalData: Omit<Goal, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newGoal = await goalsApi.createGoal(goalData);
      setGoals(prev => [newGoal, ...prev]);
      toast.success('Goal created successfully');
      return newGoal;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create goal';
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    try {
      const updatedGoal = await goalsApi.updateGoal(id, updates);
      setGoals(prev => prev.map(g => g.id === id ? updatedGoal : g));
      toast.success('Goal updated successfully');
      return updatedGoal;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update goal';
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateProgress = async (id: string, currentValue: number) => {
    try {
      const updatedGoal = await goalsApi.updateProgress(id, currentValue);
      setGoals(prev => prev.map(g => g.id === id ? updatedGoal : g));
      toast.success('Progress updated successfully');
      return updatedGoal;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update progress';
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      await goalsApi.deleteGoal(id);
      setGoals(prev => prev.filter(g => g.id !== id));
      toast.success('Goal deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete goal';
      toast.error(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return {
    goals,
    loading,
    error,
    fetchGoals,
    createGoal,
    updateGoal,
    updateProgress,
    deleteGoal
  };
}
