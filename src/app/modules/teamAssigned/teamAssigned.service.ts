import prisma from '../../utils/prisma';
import { UserRoleEnum, UserStatus } from '@prisma/client';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createTeamAssignedIntoDb = async (
  userId: string,
  data: {
    teamId: string;
    projectId: string;
    taskId: string;
  },
) => {
  return await prisma.$transaction(async prisma => {
    const existTeam = await prisma.team.findFirst({
      where: {
        id: data.teamId,
        projectId: data.projectId,
      },
    });
    if (!existTeam) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Team not found');
    }
    const existTask = await prisma.task.findFirst({
      where: {
        id: data.taskId,
        projectId: data.projectId,
      },
    });
    if (!existTask) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Task not found');
    }

    const result = await prisma.teamAssigned.create({
      data: {
        ...data,
        userId: userId,
      },
    });
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'teamAssigned not created');
    }
    if (result) {
      const totalMembers = await prisma.team.findUnique({
        where: {
          id: data.teamId,
        },
        select: {
          totalMembers: true,
        },
      });
      if (!totalMembers) {
        throw new AppError(httpStatus.BAD_REQUEST, 'totalMembers not found');
      }

      const teamAssignedUpdate = await prisma.task.update({
        where: {
          id: data.teamId,
        },
        data: {
          teamAssigned: {
            increment: 1,
          },
          membersAssigned: totalMembers.totalMembers,
        },
      });
      if (!teamAssignedUpdate) {
        throw new AppError(httpStatus.BAD_REQUEST, 'teamAssigned not updated');
      }
    }

    return result;
  });
};

const getTeamAssignedListFromDb = async (userId: string, teamId: string) => {
  // Check if the user is the project creator, supervisor, or a member
  const isAuthorized = await prisma.project.findFirst({
    where: {
      OR: [
        { userId: userId },
        { supervisorId: userId },
        {
          ProjectMember: {
            some: {
              memberId: userId,
            },
          },
        },
      ],
      Team: {
        some: {
          id: teamId,
        },
      },
    },
  });

  if (!isAuthorized) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to view this team');
  }

  const result = await prisma.teamAssigned.findMany({
    where: {
      teamId: teamId,
    },
    include: {
      User: true,
    },
  });

  return result;
};

const getTeamAssignedByIdFromDb = async (userId: string, teamAssignedId: string) => {
  // Check if the user is the project creator, supervisor, or a member
  const isAuthorized = await prisma.project.findFirst({
    where: {
      OR: [
        { userId: userId },
        { supervisorId: userId },
        {
          ProjectMember: {
            some: {
              memberId: userId,
            },
          },
        },
      ],
      TeamAssigned: {
        some: {
          id: teamAssignedId,
        },
      },
    },
  });

  if (!isAuthorized) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to view this team member');
  }

  const result = await prisma.teamAssigned.findUnique({
    where: {
      id: teamAssignedId,
    },
    include: {
      User: true,
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'teamAssigned not found');
  }

  return result;
};

const updateTeamAssignedIntoDb = async (
  userId: string,
  teamAssignedId: string,
  data: any,
) => {
  const result = await prisma.teamAssigned.update({
    where: {
      id: teamAssignedId,
      userId: userId,
    },
    data: {
      ...data,
    },
  });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'teamAssignedId, not updated');
  }
  return result;
};

const deleteTeamAssignedItemFromDb = async (
  userId: string,
  teamId: string,
  taskId: string,
) => {
  const deletedItem = await prisma.teamAssigned.deleteMany({
    where: {
      teamId: teamId,
      taskId: taskId,
      userId: userId,
    },
  });
  if (!deletedItem) {
    throw new AppError(httpStatus.BAD_REQUEST, 'teamAssignedId, not deleted');
  }

  return deletedItem;
};

export const teamAssignedService = {
  createTeamAssignedIntoDb,
  getTeamAssignedListFromDb,
  getTeamAssignedByIdFromDb,
  updateTeamAssignedIntoDb,
  deleteTeamAssignedItemFromDb,
};
