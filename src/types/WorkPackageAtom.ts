export interface WorkPackageRelation {
  type: string;
  target: string;
}

export interface WorkPackageAtom {
  id: string;
  workType: string;
  title: string;
  status: string;
  priority: string;
  description?: string;
  owner?: string;
  parent?: string;
  relations?: WorkPackageRelation[];
  labels?: string[];
  estimate?: string;
  dueDate?: string;
  extensions?: Record<string, unknown>;
}
