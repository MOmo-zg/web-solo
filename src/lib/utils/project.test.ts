import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProjects, addProject, getProjectById, updateProject, deleteProject } from './project';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  localStorageMock.clear();
  mockFetch.mockClear();
});

describe('Project Functions', () => {
  describe('getProjects', () => {
    it('should return empty array when API fails', async () => {
      // Mock response
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed to get projects' })
      });

      const projects = await getProjects();
      expect(projects.length).toBe(0);
    });

    it('should return projects from API when successful', async () => {
      const testProjects = [
        { id: '1', name: 'Test Project 1', type: 'fantasy', description: 'Test description', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '2', name: 'Test Project 2', type: 'sci-fi', description: 'Test description 2', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      ];

      // Mock response
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ projects: testProjects })
      });

      const projects = await getProjects();
      expect(projects).toEqual(testProjects);
    });
  });

  describe('addProject', () => {
    it('should add a new project', async () => {
      const newProjectData = {
        name: 'New Project',
        type: 'fantasy',
        description: 'A new fantasy project'
      };

      const createdProject = {
        id: '1',
        ...newProjectData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Mock response
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ project: createdProject })
      });

      const newProject = await addProject(newProjectData);
      expect(newProject).toEqual(createdProject);
    });

    it('should return null if API fails', async () => {
      const newProjectData = {
        name: 'New Project',
        type: 'fantasy',
        description: 'A new fantasy project'
      };

      // Mock response
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed to create project' })
      });

      const newProject = await addProject(newProjectData);
      expect(newProject).toBeNull();
    });
  });

  describe('getProjectById', () => {
    it('should return project by id', async () => {
      const testProject = {
        id: '1',
        name: 'Test Project',
        type: 'fantasy',
        description: 'Test description',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Mock response
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ project: testProject })
      });

      const project = await getProjectById('1');
      expect(project).toEqual(testProject);
    });

    it('should return null if project not found', async () => {
      // Mock response
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Project not found' })
      });

      const project = await getProjectById('non-existent-id');
      expect(project).toBeNull();
    });
  });

  describe('updateProject', () => {
    it('should update an existing project', async () => {
      const updatedProject = {
        id: '1',
        name: 'Updated Project Name',
        type: 'fantasy',
        description: 'Updated description',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Mock response
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ project: updatedProject })
      });

      const result = await updateProject('1', {
        name: 'Updated Project Name',
        description: 'Updated description'
      });

      expect(result).toEqual(updatedProject);
    });

    it('should return null if project not found', async () => {
      // Mock response
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Project not found' })
      });

      const result = await updateProject('non-existent-id', {
        name: 'Updated Name'
      });
      expect(result).toBeNull();
    });
  });

  describe('deleteProject', () => {
    it('should delete a project', async () => {
      // Mock response
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });

      const result = await deleteProject('1');
      expect(result).toBe(true);
    });

    it('should return false if project not found', async () => {
      // Mock response
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Project not found' })
      });

      const result = await deleteProject('non-existent-id');
      expect(result).toBe(false);
    });
  });
});
