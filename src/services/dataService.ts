export interface BaseEntity { id: string; createdAt: string; updatedAt: string }
export interface Project extends BaseEntity { name: string; description?: string }
export interface Note extends BaseEntity { title: string; content: string; projectId?: string }
export interface Task extends BaseEntity { title: string; description?: string; completed: boolean; dueDate?: string; projectId?: string }
export interface Memory extends BaseEntity { content: string; category: string; projectId?: string }

export const dataService = {
  list<T>(collection: DataCollection): Promise<T[]> { return window.projectNoir?.data.list<T>(collection) ?? Promise.resolve([]); },
  create<T>(collection: DataCollection, input: Partial<T>): Promise<T> {
    if (!window.projectNoir) return Promise.reject(new Error("Persistência disponível no aplicativo desktop."));
    return window.projectNoir.data.create<T>(collection, input);
  },
  update<T>(collection: DataCollection, id: string, changes: Partial<T>): Promise<T> {
    if (!window.projectNoir) return Promise.reject(new Error("Persistência disponível no aplicativo desktop."));
    return window.projectNoir.data.update<T>(collection, id, changes);
  },
  remove(collection: DataCollection, id: string): Promise<boolean> {
    if (!window.projectNoir) return Promise.reject(new Error("Persistência disponível no aplicativo desktop."));
    return window.projectNoir.data.remove(collection, id);
  },
};
