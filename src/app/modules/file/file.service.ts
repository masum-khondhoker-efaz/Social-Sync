import prisma from '../../utils/prisma';
import { UserRoleEnum, UserStatus } from '@prisma/client';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createFileIntoDb = async (userId: string, fileData: any) => {
  const { data, fileUrl, size } = fileData;

  const result = await prisma.files.create({
    data: {
      ...data,
      fileUrl: fileUrl,
      size: size.toString(),
      userId: userId,
    },
    select: {
      id: true,
      userId: true,
      fileUrl: true,
      projectId: true,
      size: true,
      fileName: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'file not created');
  }
  return result;
};

const getFileListFromDb = async (userId: string, projectId: string) => {
  const result = await prisma.files.findMany({
    where: {
      projectId: projectId,
    },
    select: {
      id: true,
      userId: true,
      fileUrl: true,
      projectId: true,
      fileName: true,
      size: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (result.length === 0) {
    return result;
  }
  return result;
};

const getFileByIdFromDb = async (fileId: string) => {
  const result = await prisma.files.findUnique({
    where: {
      id: fileId,
    },
    select: {
      id: true,
      userId: true,
      fileUrl: true,
      projectId: true,
      fileName: true,
      size: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'file not found');
  }
  return result;
};

const updateFileIntoDb = async (userId: string, fileId: string, data: any) => {
  const result = await prisma.files.update({
    where: {
      id: fileId,
      projectId: data.projectId,
      userId: userId,
    },
    data: {
      fileUrl: data.fileUrl,
      projectId: data.projectId,
      size: data.size,
    },
    select: {
      id: true,
      userId: true,
      fileUrl: true,
      projectId: true,
      fileName: true,
      size: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'file, not updated');
  }
  return result;
};

const deleteFileItemFromDb = async (userId: string, fileId: string) => {
  const deletedItem = await prisma.files.delete({
    where: {
      id: fileId,
      userId: userId,
    },
  });
  if (!deletedItem) {
    throw new AppError(httpStatus.BAD_REQUEST, 'fileId, not deleted');
  }
  return deletedItem;
};

export const fileService = {
  createFileIntoDb,
  getFileListFromDb,
  getFileByIdFromDb,
  updateFileIntoDb,
  deleteFileItemFromDb,
};
