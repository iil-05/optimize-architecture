import { useState, useEffect, useCallback } from 'react';
import { optimizedStorage, ProjectData, UserProfile, UserPreferences } from '../utils/optimizedStorage';

// Custom hook for optimized storage operations
export const useOptimizedStorage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User operations
  const useUser = () => {
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
      const userData = optimizedStorage.getUser();
      setUser(userData?.profile || null);
    }, []);

    const updateUser = useCallback(async (userData: UserProfile) => {
      setIsLoading(true);
      try {
        optimizedStorage.saveUser(userData);
        setUser(userData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update user');
      } finally {
        setIsLoading(false);
      }
    }, []);

    return { user, updateUser, isLoading, error };
  };

  // User preferences operations
  const useUserPreferences = () => {
    const [preferences, setPreferences] = useState<UserPreferences | null>(null);

    useEffect(() => {
      const prefs = optimizedStorage.getUserPreferences();
      setPreferences(prefs);
    }, []);

    const updatePreferences = useCallback(async (newPreferences: UserPreferences) => {
      setIsLoading(true);
      try {
        optimizedStorage.saveUserPreferences(newPreferences);
        setPreferences(newPreferences);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update preferences');
      } finally {
        setIsLoading(false);
      }
    }, []);

    return { preferences, updatePreferences, isLoading, error };
  };

  // Project operations
  const useProjects = () => {
    const [projects, setProjects] = useState<ProjectData[]>([]);

    const loadProjects = useCallback(async () => {
      setIsLoading(true);
      try {
        const projectsData = optimizedStorage.getAllProjects();
        setProjects(projectsData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    }, []);

    useEffect(() => {
      loadProjects();
    }, [loadProjects]);

    const saveProject = useCallback(async (project: ProjectData) => {
      setIsLoading(true);
      try {
        optimizedStorage.saveProject(project);
        await loadProjects(); // Reload to get updated data
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save project');
      } finally {
        setIsLoading(false);
      }
    }, [loadProjects]);

    const deleteProject = useCallback(async (projectId: string) => {
      setIsLoading(true);
      try {
        optimizedStorage.deleteProject(projectId);
        await loadProjects(); // Reload to get updated data
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete project');
      } finally {
        setIsLoading(false);
      }
    }, [loadProjects]);

    return { projects, saveProject, deleteProject, loadProjects, isLoading, error };
  };

  // Analytics operations
  const useAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);

    const loadAnalytics = useCallback(async () => {
      setIsLoading(true);
      try {
        const analyticsData = optimizedStorage.getAnalytics();
        setAnalytics(analyticsData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
      } finally {
        setIsLoading(false);
      }
    }, []);

    useEffect(() => {
      loadAnalytics();
    }, [loadAnalytics]);

    return { analytics, loadAnalytics, isLoading, error };
  };

  // Cache operations
  const useCache = () => {
    const getCache = useCallback((key: string) => {
      try {
        return optimizedStorage.getCache(key);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get cache');
        return null;
      }
    }, []);

    const setCache = useCallback((key: string, data: any, ttlMinutes: number = 60) => {
      try {
        optimizedStorage.setCache(key, data, ttlMinutes);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to set cache');
      }
    }, []);

    const clearCache = useCallback(() => {
      try {
        optimizedStorage.clearCache();
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to clear cache');
      }
    }, []);

    return { getCache, setCache, clearCache, error };
  };

  // Storage health monitoring
  const useStorageHealth = () => {
    const [healthData, setHealthData] = useState(null);

    const checkHealth = useCallback(async () => {
      setIsLoading(true);
      try {
        const health = optimizedStorage.getStorageHealth();
        setHealthData(health);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check storage health');
      } finally {
        setIsLoading(false);
      }
    }, []);

    const cleanup = useCallback(async (daysOld: number = 30) => {
      setIsLoading(true);
      try {
        const cleanedItems = optimizedStorage.cleanupOldData(daysOld);
        await checkHealth(); // Refresh health data
        setError(null);
        return cleanedItems;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to cleanup storage');
        return 0;
      } finally {
        setIsLoading(false);
      }
    }, [checkHealth]);

    return { healthData, checkHealth, cleanup, isLoading, error };
  };

  // Export/Import operations
  const useDataManagement = () => {
    const exportData = useCallback(() => {
      try {
        const data = optimizedStorage.exportAllData();
        setError(null);
        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to export data');
        return null;
      }
    }, []);

    const importData = useCallback(async (jsonData: string) => {
      setIsLoading(true);
      try {
        const success = optimizedStorage.importAllData(jsonData);
        setError(success ? null : 'Failed to import data');
        return success;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to import data');
        return false;
      } finally {
        setIsLoading(false);
      }
    }, []);

    return { exportData, importData, isLoading, error };
  };

  return {
    useUser,
    useUserPreferences,
    useProjects,
    useAnalytics,
    useCache,
    useStorageHealth,
    useDataManagement,
    isLoading,
    error
  };
};

// Specific hooks for common operations
export const useUserProfile = () => {
  const { useUser } = useOptimizedStorage();
  return useUser();
};

export const useProjectManagement = () => {
  const { useProjects } = useOptimizedStorage();
  return useProjects();
};

export const useStorageAnalytics = () => {
  const { useAnalytics } = useOptimizedStorage();
  return useAnalytics();
};