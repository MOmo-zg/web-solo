import { describe, it, expect, vi } from 'vitest';
import { getProjects, addProject, updateProject, deleteProject, getProjectById } from './project';

// 模拟 fetch 函数
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

// 模拟 localStorage
const mockLocalStorage: Record<string, string> = {};
global.localStorage = {
  getItem: (key: string) => mockLocalStorage[key] || null,
  setItem: (key: string, value: string) => {
    mockLocalStorage[key] = value;
  },
  removeItem: (key: string) => {
    delete mockLocalStorage[key];
  },
  clear: () => {
    Object.keys(mockLocalStorage).forEach(key => delete mockLocalStorage[key]);
  },
  length: 0,
  key: (index: number) => Object.keys(mockLocalStorage)[index] || null
} as any;

describe('project utils', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    localStorage.clear();
  });

  describe('getProjects', () => {
    it('should return projects from API', async () => {
      const mockProjects = [
        { id: '1', name: 'Test Project', type: 'Test', description: 'Test description', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      ];

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ projects: mockProjects })
      });

      const projects = await getProjects();
      expect(projects).toEqual(mockProjects);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/projects', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });

    it('should return empty array on error', async () => {
      mockFetch.mockResolvedValue({
        ok: false
      });

      const projects = await getProjects();
      expect(projects).toEqual([]);
    });
  });

  describe('addProject', () => {
    it('should add a new project', async () => {
      const newProject = { name: 'New Project', type: 'Test', description: 'New project description' };
      const mockResponse = { id: '1', ...newProject, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ project: mockResponse })
      });

      const result = await addProject(newProject);
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProject)
      });
    });

    it('should return null on error', async () => {
      const newProject = { name: 'New Project', type: 'Test', description: 'New project description' };

      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Error' })
      });

      const result = await addProject(newProject);
      expect(result).toBeNull();
    });
  });

  describe('updateProject', () => {
    it('should update a project', async () => {
      const projectId = '1';
      const updates = { name: 'Updated Project', type: 'Test', description: 'Updated description' };
      const mockResponse = { id: projectId, ...updates, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ project: mockResponse })
      });

      const result = await updateProject(projectId, updates);
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(`http://localhost:3001/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
    });

    it('should return null on error', async () => {
      const projectId = '1';
      const updates = { name: 'Updated Project', type: 'Test', description: 'Updated description' };

      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Error' })
      });

      const result = await updateProject(projectId, updates);
      expect(result).toBeNull();
    });
  });

  describe('deleteProject', () => {
    it('should delete a project', async () => {
      const projectId = '1';

      mockFetch.mockResolvedValue({
        ok: true
      });

      const result = await deleteProject(projectId);
      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(`http://localhost:3001/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });

    it('should return false on error', async () => {
      const projectId = '1';

      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Error' })
      });

      const result = await deleteProject(projectId);
      expect(result).toBe(false);
    });
  });

  describe('getProjectById', () => {
    it('should get a project by id', async () => {
      const projectId = '1';
      const mockProject = { id: projectId, name: 'Test Project', type: 'Test', description: 'Test description', created_at: new Date().toISOString(), updated_at: new Date().toISOString() };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ project: mockProject })
      });

      const result = await getProjectById(projectId);
      expect(result).toEqual(mockProject);
      expect(mockFetch).toHaveBeenCalledWith(`http://localhost:3001/api/projects/${projectId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });

    it('should return null on error', async () => {
      const projectId = '1';

      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Error' })
      });

      const result = await getProjectById(projectId);
      expect(result).toBeNull();
    });
  });
});
