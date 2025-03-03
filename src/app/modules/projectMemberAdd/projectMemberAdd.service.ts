import prisma from '../../utils/prisma';
import { UserRoleEnum, UserStatus } from '@prisma/client';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createProjectMemberAddIntoDb = async (
  userId: string,
  data: {
    projectId: string;
    memberId: string;
  },
) => {
  return await prisma.$transaction(async prisma => {
    const existMember = await prisma.user.findFirst({
      where: {
        id: data.memberId,
      },
    });
    if (!existMember) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Member not found');
    }

    const result = await prisma.projectMember.create({
      data: {
        projectId: data.projectId,
        userId: userId,
        memberId: data.memberId,
      },
    });
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Project member not created');
    }

    const projectMemberUpdate = await prisma.project.update({
      where: {
        id: data.projectId,
      },
      data: {
        members: {
          increment: 1,
        },
      },
    });
    if (!projectMemberUpdate) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Project member add not updated',
      );
    }

    const isAvailable = await prisma.user.update({
      where: {
        id: data.memberId,
      },
      data: {
        role: UserRoleEnum.MEMBER,
        isAvailable: false,
      },
    });

    if (!isAvailable) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Role not updated');
    }

    return projectMemberUpdate;
  });
};

const getProjectMemberAddListFromDb = async (
  userId: string,
  projectId: string,
) => {
  // Check if the user is connected to the project as a creator, supervisor, or member
  const isConnected = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { userId: userId }, // Project creator
        { supervisorId: userId }, // Project supervisor
        {
          ProjectMember: {
            some: {
              memberId: userId, // Project member
            },
          },
        },
      ],
    },
  });

  if (!isConnected) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You do not have access to this project member list',
    );
  }

  const result = await prisma.projectMember.findMany({
    where: {
      projectId: projectId,
    },
    select: {
      projectId: true,
      member: {
        select: {
          id: true,
          userName: true,
          email: true,
          company: true,
          fullName: true,
          phone: true,
          role: true,
          image: true,
          isAvailable: true,
        },
      },
    },
  });

  if (result.length === 0) {
    return result;
  }
  return result.map(item => ({
    projectId: item.projectId,
    ...item.member,
  }));
};

const getProjectMemberAddByIdFromDb = async (
  userId: string,
  projectId: string,
  memberId: string,
) => {
  // Check if the user is connected to the project as a creator, supervisor, or member
  const isConnected = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { userId: userId }, // Project creator
        { supervisorId: userId }, // Project supervisor
        {
          ProjectMember: {
            some: {
              memberId: userId, // Project member
            },
          },
        },
      ],
    },
  });

  if (!isConnected) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You do not have access to this project member details',
    );
  }

  const result = await prisma.projectMember.findFirst({
    where: {
      projectId: projectId,
      memberId: memberId,
    },
    include: {
      member: {
        select: {
          id: true,
          userName: true,
          email: true,
          company: true,
          fullName: true,
          phone: true,
          role: true,
          image: true,
          isAvailable: true,
        },
      },
    },
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Project member not found');
  }

  return {
    projectId: result.projectId,
    ...result.member,
  };
};

const updateProjectMemberAddIntoDb = async (
  userId: string,
  projectMemberAddId: string,
  data: any,
) => {
  const result = await prisma.projectMember.update({
    where: {
      id: projectMemberAddId,
      userId: userId,
    },
    data: {
      ...data,
    },
  });
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'projectMemberAddId, not updated',
    );
  }
  return result;
};

const deleteProjectMemberAddItemFromDb = async (
  userId: string,
  projectId: string,
  memberAddId: string,
) => {
  const deletedItem = await prisma.projectMember.deleteMany({
    where: {
      projectId: projectId,
      memberId: memberAddId,
      userId: userId,
    },
  });
  if (!deletedItem) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'projectMemberAddId, not deleted',
    );
  }

  const projectMemberUpdate = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      members: {
        decrement: 1,
      },
    },
  });
  if (!projectMemberUpdate) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Project member add not updated',
    );
  }

  return deletedItem;
};

export const projectMemberAddService = {
  createProjectMemberAddIntoDb,
  getProjectMemberAddListFromDb,
  getProjectMemberAddByIdFromDb,
  updateProjectMemberAddIntoDb,
  deleteProjectMemberAddItemFromDb,
};
