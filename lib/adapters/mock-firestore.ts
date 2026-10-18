export class MockFirestoreAdapter {
  private store: Map<string, any> = new Map();
  collection(name: string) {
    const colRef: any = {
      doc: (id: string) => ({
        get: async () => ({ exists: this.store.has(id), data: () => this.store.get(id) }),
        set: async (val: any) => { this.store.set(id, val); return true; },
        delete: async () => { this.store.delete(id); return true; }
      }),
      where: (field: string, op: string, val: any) => colRef,
      orderBy: (field: string, direction?: string) => colRef,
      limit: (n: number) => colRef,
      get: async () => ({ docs: Array.from(this.store.entries()).map(([id, data]) => ({ id, data: () => data })) }),
      add: async (val: any) => { const id = Math.random().toString(36).substring(7); this.store.set(id, val); return { id }; }
    };
    return colRef;
  }
}
export const mockDb = new MockFirestoreAdapter();
