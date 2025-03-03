import prisma from '../../utils/prisma';
import { UserRoleEnum, UserStatus } from '@prisma/client';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createProjectIntoDb = async (userId: string, data: any) => {
  return await prisma.$transaction(async prisma => {
    try {
      const result = await prisma.project.create({
        data: {
          ...data,
          userId: userId,
        },
      });
      if (!result) {
        throw new AppError(httpStatus.BAD_REQUEST, 'project not created');
      }

      const addProjectMember = await prisma.projectMember.create({
        data: {
          projectId: result.id,
          userId: userId,
          memberId: data.supervisorId,
        },
      });
      if (!addProjectMember) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Project member not created',
        );
      }

      const managerToProjectMember = await prisma.projectMember.create({
        data: {
          projectId: result.id,
          userId: userId,
          memberId: data.userId,
        },
      });
      if (!managerToProjectMember) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Project member not created',
        );
      }
      const checkProjectCount = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          projectCreated: true,
        },
      });
      if (checkProjectCount?.projectCreated === 3) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'You have reached the maximum limit of creating projects',
        );
      }

      const addProjectCount = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          projectCreated: {
            increment: 1,
          },
        },
      });
      if (!addProjectCount) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Project count not updated');
      }

      const groupCreate = await prisma.room.create({
        data: {
          projectId: result.id,
          creatorId: userId,
          participants: {
            create: {
              userId: userId, // Add the creator as the first participant
            },
          },
        },
        include: {
          participants: true,
        },
      });
      if (!groupCreate) {
        throw new AppError(httpStatus.BAD_REQUEST, 'group not created');
      }

      return { result, roomId: groupCreate.id };
    } catch (error) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Transaction failed',
      );
    }
  });
};

const getProjectListFromDb = async (userId: string) => {
  const result = await prisma.project.findMany({
    where: {
      OR: [
        { userId: userId },
        { supervisorId: userId },
        { ProjectMember: { some: { userId: userId } } },
      ],
    },
    include: {
      Room: {
        select: {
          id: true,
        },
      },
    },
  });
  if (result.length === 0) {
    return result;
  }
  return result;
};

const getProjectByIdFromDb = async (userId: string, projectId: string) => {
  const result = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { userId: userId },
        { supervisorId: userId },
        { ProjectMember: { some: { userId: userId } } },
      ],
    },
    include: {
      user: {
        select: {
          fcmToken: true,
        },
      },
      supervisor: {
        select: {
          fcmToken: true,
        },
      },
    },
  });
  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'project not found or access denied',
    );
  }
  return result;
};

const updateProjectIntoDb = async (
  userId: string,
  projectId: string,
  data: any,
) => {
  const result = await prisma.project.update({
    where: {
      id: projectId,
      userId: userId,
    },
    data: {
      ...data,
    },
  });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'projectId, not updated');
  }
  return result;
};

const deleteProjectItemFromDb = async (userId: string, projectId: string) => {
  const deletedItem = await prisma.project.delete({
    where: {
      id: projectId,
      userId: userId,
    },
  });
  if (!deletedItem) {
    throw new AppError(httpStatus.BAD_REQUEST, 'projectId, not deleted');
  }

  return deletedItem;
};

export const projectService = {
  createProjectIntoDb,
  getProjectListFromDb,
  getProjectByIdFromDb,
  updateProjectIntoDb,
  deleteProjectItemFromDb,
};
