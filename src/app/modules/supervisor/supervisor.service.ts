import prisma from '../../utils/prisma';
import { UserRoleEnum, UserStatus } from '@prisma/client';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createSupervisorIntoDb = async (
  userId: string,
  data: {
    supervisorId: string;
  },
) => {
  return await prisma.$transaction(async prisma => {
    const existSupervisor = await prisma.user.findUnique({
      where: {
        id: data.supervisorId,
        isAvailable: true,
      },
    });
    if (!existSupervisor) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User is not available');
    }
    const result = await prisma.supervisor.create({
      data: {
        ...data,
        userId: userId,
      },
    });
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Supervisor not created');
    }
    const roleUpdate = await prisma.user.update({
      where: {
        id: data.supervisorId!,
      },
      data: {
        role: UserRoleEnum.SUPERVISOR,
        isAvailable: false,
      },
    });
    if (!roleUpdate) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Role not updated');
    }
    return result;
  });
};

const getSupervisorListFromDb = async (searchQuery?: string) => {
  const result = await prisma.supervisor.findMany({
    where: {
      supervisor: {
        role: UserRoleEnum.SUPERVISOR, // Always filter by role
        ...(searchQuery && {
          userName: {
            contains: searchQuery, // Apply searchQuery conditionally
          },
        }),
      },
    },
    select: {
      id: true,
      supervisor: {
        select: {
          id: true,
          userName: true,
          email: true,
          role: true,
          company: true,
          fullName: true,
          image: true,
        },
      },
    },
  });

  if (result.length === 0) {
    return result;
  }

  return result.map(item => item.supervisor);
};

const getSupervisorByIdFromDb = async (supervisorId: string) => {
  const result = await prisma.supervisor.findFirst({
    where: {
      supervisorId: supervisorId,
    },
    include: {
      supervisor: {
        select: {
          fullName: true,
          userName: true,
          phone: true,
          email: true,
          company: true,
          image: true,
        },
      },
    },
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'supervisor not found');
  }
  return result;
};

const updateSupervisorIntoDb = async (
  userId: string,
  supervisorId: string,
  data: any,
) => {
  const result = await prisma.supervisor.update({
    where: {
      id: supervisorId,
      userId: userId,
    },
    data: {
      ...data,
    },
  });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'supervisorId, not updated');
  }
  return result;
};

const deleteSupervisorItemFromDb = async (
  userId: string,
  supervisorId: string,
) => {
  const deletedItem = await prisma.supervisor.delete({
    where: {
      id: supervisorId,
      userId: userId,
    },
  });
  if (!deletedItem) {
    throw new AppError(httpStatus.BAD_REQUEST, 'supervisorId, not deleted');
  }
  if (deletedItem) {
    const roleUpdate = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: UserRoleEnum.MEMBER,
      },
    });
    if (!roleUpdate) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Role not updated');
    }
  }

  return deletedItem;
};

export const supervisorService = {
  createSupervisorIntoDb,
  getSupervisorListFromDb,
  getSupervisorByIdFromDb,
  updateSupervisorIntoDb,
  deleteSupervisorItemFromDb,
};
