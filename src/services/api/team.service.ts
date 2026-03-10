/**
 * Team API Service - CRUD operations for teams
 * Currently using mock data - Update to use real API calls when backend is ready
 */

import { API_CONFIG } from "../config/api.config";
import { httpClient } from "../config/http.client";
import type { ApiResponse, PaginatedResponse, Team, TeamMember, CreateTeamRequest, UpdateTeamRequest } from "@/models";
import { MOCK_TEAMS, delay } from "./mock.data";

const USE_MOCK_DATA = true; // Toggle to switch between mock and real API

export class TeamService {
  /**
   * Get all teams with pagination
   */
  static async getTeams(page: number = 0, pageSize: number = 10): Promise<PaginatedResponse<Team>> {
    if (USE_MOCK_DATA) {
      await delay();
      const start = page * pageSize;
      const end = start + pageSize;
      return {
        content: MOCK_TEAMS.slice(start, end),
        totalElements: MOCK_TEAMS.length,
        totalPages: Math.ceil(MOCK_TEAMS.length / pageSize),
        currentPage: page,
        pageSize: pageSize,
        hasNext: end < MOCK_TEAMS.length,
        hasPrevious: page > 0,
      };
    }

    const response = await httpClient.get<ApiResponse<PaginatedResponse<Team>>>(
      `${API_CONFIG.ENDPOINTS.TEAMS.LIST}?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  }

  /**
   * Get team by ID
   */
  static async getTeamById(id: string): Promise<Team> {
    if (USE_MOCK_DATA) {
      await delay();
      const team = MOCK_TEAMS.find((t) => t.id === id);
      if (!team) throw new Error("Team not found");
      return team;
    }

    const response = await httpClient.get<ApiResponse<Team>>(
      API_CONFIG.ENDPOINTS.TEAMS.GET(id)
    );
    return response.data;
  }

  /**
   * Create new team
   */
  static async createTeam(teamData: CreateTeamRequest): Promise<Team> {
    if (USE_MOCK_DATA) {
      await delay();
      const newTeam: Team = {
        id: `TEAM${MOCK_TEAMS.length + 1}`,
        name: teamData.name,
        description: teamData.description,
        members: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_TEAMS.push(newTeam);
      return newTeam;
    }

    const response = await httpClient.post<ApiResponse<Team>>(
      API_CONFIG.ENDPOINTS.TEAMS.CREATE,
      teamData
    );
    return response.data;
  }

  /**
   * Update team
   */
  static async updateTeam(id: string, teamData: UpdateTeamRequest): Promise<Team> {
    if (USE_MOCK_DATA) {
      await delay();
      const teamIndex = MOCK_TEAMS.findIndex((t) => t.id === id);
      if (teamIndex === -1) throw new Error("Team not found");
      MOCK_TEAMS[teamIndex] = {
        ...MOCK_TEAMS[teamIndex],
        name: teamData.name ?? MOCK_TEAMS[teamIndex].name,
        description: teamData.description ?? MOCK_TEAMS[teamIndex].description,
        updatedAt: new Date().toISOString(),
      };
      return MOCK_TEAMS[teamIndex];
    }

    const response = await httpClient.put<ApiResponse<Team>>(
      API_CONFIG.ENDPOINTS.TEAMS.UPDATE(id),
      teamData
    );
    return response.data;
  }

  /**
   * Delete team
   */
  static async deleteTeam(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await delay();
      const teamIndex = MOCK_TEAMS.findIndex((t) => t.id === id);
      if (teamIndex === -1) throw new Error("Team not found");
      MOCK_TEAMS.splice(teamIndex, 1);
      return;
    }

    await httpClient.delete(
      API_CONFIG.ENDPOINTS.TEAMS.DELETE(id)
    );
  }

  /**
   * Get team members
   */
  static async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    if (USE_MOCK_DATA) {
      await delay();
      const team = MOCK_TEAMS.find((t) => t.id === teamId);
      if (!team) throw new Error("Team not found");
      return team.members;
    }

    const response = await httpClient.get<ApiResponse<TeamMember[]>>(
      API_CONFIG.ENDPOINTS.TEAMS.MEMBERS(teamId)
    );
    return response.data;
  }

  /**
   * Add member to team
   */
  static async addTeamMember(teamId: string, userId: string): Promise<TeamMember> {
    if (USE_MOCK_DATA) {
      await delay();
      const team = MOCK_TEAMS.find((t) => t.id === teamId);
      if (!team) throw new Error("Team not found");

      const newMember: TeamMember = {
        id: `TM${Math.floor(Math.random() * 10000)}`,
        userId,
        firstName: "New",
        lastName: "Member",
        email: "member@coconut.com",
        role: "MEMBER" as any,
        joinedAt: new Date().toISOString(),
      };
      team.members.push(newMember);
      return newMember;
    }

    const response = await httpClient.post<ApiResponse<TeamMember>>(
      API_CONFIG.ENDPOINTS.TEAMS.MEMBERS(teamId),
      { userId }
    );
    return response.data;
  }

  /**
   * Remove member from team
   */
  static async removeTeamMember(teamId: string, memberId: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await delay();
      const team = MOCK_TEAMS.find((t) => t.id === teamId);
      if (!team) throw new Error("Team not found");
      team.members = team.members.filter((m) => m.id !== memberId);
      return;
    }

    await httpClient.delete(
      `${API_CONFIG.ENDPOINTS.TEAMS.MEMBERS(teamId)}/${memberId}`
    );
  }
}
