 export type Project = {
    id: string;
    name: string;
    description: string;
    status: ProjectStatus;
  };
  export type ProjectStatus = "pending" | "completed" | "failed";