import prisma from '../../utils/prisma';
import { UserRoleEnum, UserStatus } from '@prisma/client';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createTeamMemberIntoDb = async (
  userId: string,
  data: {
    teamId: string;
    projectId: string;
    memberId: string;
  },
) => {
  return await prisma.$transaction(async (prisma) => {
    const memberExistInProject = await prisma.projectMember.findFirst({
      where: {
        memberId: data.memberId,
        projectId: data.projectId,
      },
      include: {
        member: true,
      },
    });
    if (!memberExistInProject?.member) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Member not found in project');
    }

    const result = await prisma.teamMember.create({
      data: {
        ...data,
        userId: userId,
      },
    });
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Team member not created');
    }

    const teamMemberUpdate = await prisma.team.update({
      where: {
        id: data.teamId,
      },
      data: {
        totalMembers: {
          increment: 1,
        },
      },
    });
    if (!teamMemberUpdate) {
      throw new AppError(httpStatus.BAD_REQUEST, 'teamMember add not updated');
    }
    return result;
  });
};

const getTeamMemberListFromDb = async (userId: string, teamId: string) => {
  // Check if the user is the project creator, supervisor, or a member
  const project = await prisma.project.findFirst({
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

  if (!project) {
    throw new AppError(httpStatus.FORBIDDEN, 'You do not have access to this team');
  }

  const result = await prisma.teamMember.findMany({
    where: {
      teamId: teamId,
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          image: true,
          company: true,
          userName: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (result.length === 0) {
    return result;
  }
  return result;
};


const getTeamMemberByIdFromDb = async (userId: string, teamMemberId: string, teamId: string) => {
  // Check if the user is the project creator, supervisor, or a member
  const project = await prisma.project.findFirst({
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

  if (!project) {
    throw new AppError(httpStatus.FORBIDDEN, 'You do not have access to this team');
  }

  const result = await prisma.user.findUnique({
    where: {
      id: teamMemberId,
    },
    select: {
      id: true,
      fullName: true,
      image: true,
      company: true,
      userName: true,
      email: true,
      role: true,
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'teamMember not found');
  }
  return result;
};

const updateTeamMemberIntoDb = async (
  userId: string,
  teamMemberId: string,
  data: any,
) => {
  const result = await prisma.teamMember.update({
    where: {
      id: teamMemberId,
      userId: userId,
    },
    data: {
      ...data,
    },
  });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'teamMemberId, not updated');
  }
  return result;
};

const deleteTeamMemberItemFromDb = async (
  userId: string,
  teamMemberId: string,
) => {
  const deletedItem = await prisma.teamMember.delete({
    where: {
      id: teamMemberId,
      userId: userId,
    },
  });
  if (!deletedItem) {
    throw new AppError(httpStatus.BAD_REQUEST, 'teamMemberId, not deleted');
  }

  return deletedItem;
};

export const teamMemberService = {
  createTeamMemberIntoDb,
  getTeamMemberListFromDb,
  getTeamMemberByIdFromDb,
  updateTeamMemberIntoDb,
  deleteTeamMemberItemFromDb,
};
