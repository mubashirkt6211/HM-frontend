/**
 * Team Model
 */
export interface Team {
  id: string;
  name: string;
  description?: string;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Team Member Model
 */
export interface TeamMember {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: TeamMemberRole;
  joinedAt: string;
}

export const TeamMemberRole = {
  LEAD: "LEAD",
  MEMBER: "MEMBER",
  CONTRIBUTOR: "CONTRIBUTOR",
} as const;

export type TeamMemberRole = typeof TeamMemberRole[keyof typeof TeamMemberRole];

/**
 * Team request for creation/update
 */
export interface CreateTeamRequest {
  name: string;
  description?: string;
  memberIds?: string[];
}

export interface UpdateTeamRequest extends Partial<CreateTeamRequest> {}
