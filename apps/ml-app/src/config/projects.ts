export type MlProject = {
  id: string;
  title: string;
  description?: string;
  menus: Array<{ id: string; title: string }>;
};

export const projects: MlProject[] = [];
