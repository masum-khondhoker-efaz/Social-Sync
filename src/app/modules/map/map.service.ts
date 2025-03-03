import prisma from '../../utils/prisma';
import { UserRoleEnum, UserStatus } from '@prisma/client';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { map } from 'zod';

const createMapIntoDb = async (
  userId: string,
  mapData: {
    data: any;
    mapImage: string;
    fileSize: number;
  },
) => {
  const fileSizeInMB = (mapData.fileSize / (1024 * 1024)).toFixed(2);

  const transaction = await prisma.$transaction(async (prisma) => {
    const result = await prisma.map.create({
      data: {
        ...mapData.data,
        map: mapData.mapImage,
        size: fileSizeInMB.toString(),
        userId: userId,
      },
    });
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'map not created');
    }

    const checkMapCount = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        mapCreated: true,
      },
    });
    if (checkMapCount?.mapCreated === 5) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'You have reached the maximum limit of creating maps',
      );
    }

    const updateMapCount = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        mapCreated: {
          increment: 1,
        },
      },
    });
    if (!updateMapCount) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Map count not updated');
    }

    return result;
  });

  return transaction;
};

const getMapListFromDb = async (userId: string, searchQuery?: string) => {
  const result = await prisma.map.findMany({
    where: {
      ...(searchQuery && {
        title: {
          contains: searchQuery,
        },
      }),
    },
  });
  if (result.length === 0) {
    return result;
  }
  return result;
};

const getMapByIdFromDb = async (userId: string, mapId: string) => {
  const result = await prisma.map.findUnique({
    where: {
      id: mapId,
    },
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'map not found');
  }
  return result;
};

const updateMapIntoDb = async (
  userId: string,
  mapId: string,
  mapData: {
    data: any;
    mapImage?: string;
    size?: string;
  },
) => {
  const updateData: any = {
    ...mapData.data,
  };

  if (mapData.mapImage) {
    updateData.map = mapData.mapImage;
  }

  if (mapData.size) {
    updateData.fileSize = mapData.size;
  }

  const result = await prisma.map.update({
    where: {
      id: mapId,
      userId: userId,
    },
    data: {
      ...updateData,
      ...(mapData.mapImage && { map: mapData.mapImage }),
      ...(mapData.size && { size: mapData.size }),
    },
  });

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'mapId, not updated');
  }

  return result;
};

const deleteMapItemFromDb = async (userId: string, mapId: string) => {
  const deletedItem = await prisma.map.delete({
    where: {
      id: mapId,
      userId: userId,
    },
  });
  if (!deletedItem) {
    throw new AppError(httpStatus.BAD_REQUEST, 'mapId, not deleted');
  }

  return deletedItem;
};

export const mapService = {
  createMapIntoDb,
  getMapListFromDb,
  getMapByIdFromDb,
  updateMapIntoDb,
  deleteMapItemFromDb,
};
