export interface AdminLog {
  id: number;
  actorId: number;
  actorName: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId?: number | null;
  metadata: string;
  ipAddress: string;
  createdAt: string;
}
