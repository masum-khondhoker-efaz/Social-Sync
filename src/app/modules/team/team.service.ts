import prisma from '../../utils/prisma';
import { UserRoleEnum, UserStatus } from '@prisma/client';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createTeamIntoDb = async (
  userId: string,
  teamData: {
    data: any;
    teamLogo: string;
  },
) => {
  const result = await prisma.team.create({
    data: {
      ...teamData.data,
      teamLogo: teamData.teamLogo,
      userId: userId,
    },
  });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Team not created');
  }
  return result;
};

const getTeamListFromDb = async (userId: string, projectId: string) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      user: true,
      supervisor: true,
      ProjectMember: true,
    },
  });

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, 'Project not found');
  }

  const isAuthorized =
    project.userId === userId ||
    project.supervisorId === userId ||
    project.ProjectMember.some(member => member.userId === userId);

  if (!isAuthorized) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to view this team');
  }

  const result = await prisma.team.findMany({
    where: {
      projectId: projectId,
    },
  });

  return result;
};

const getTeamByIdFromDb = async (userId: string, teamId: string) => {
  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!team) {
    throw new AppError(httpStatus.NOT_FOUND, 'Team not found');
  }

  const project = await prisma.project.findUnique({
    where: {
      id: team.projectId,
    },
    include: {
      user: true,
      supervisor: true,
      ProjectMember: true,
    },
  });

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, 'Project not found');
  }

  const isAuthorized =
    project.userId === userId ||
    project.supervisorId === userId ||
    project.ProjectMember.some(member => member.userId === userId);

    console.log(isAuthorized)

  if (!isAuthorized) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to view this team');
  }

  return team;
};

const updateTeamIntoDb = async (userId: string, teamId: string, teamData: {
  data: any;
  teamLogo?: string;
}) => {
  const result = await prisma.team.update({
    where: {
      id: teamId,
      userId: userId,
    },
    data: {
      ...teamData.data,
      ...(teamData.teamLogo && { teamLogo: teamData.teamLogo }),
    },
  });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'teamId, not updated');
  }
  return result;
};

const deleteTeamItemFromDb = async (userId: string, teamId: string) => {
  const deletedItem = await prisma.team.delete({
    where: {
      id: teamId,
      userId: userId,
    },
  });
  if (!deletedItem) {
    throw new AppError(httpStatus.BAD_REQUEST, 'teamId, not deleted');
  }

  return deletedItem;
};

export const teamService = {
  createTeamIntoDb,
  getTeamListFromDb,
  getTeamByIdFromDb,
  updateTeamIntoDb,
  deleteTeamItemFromDb,
};
