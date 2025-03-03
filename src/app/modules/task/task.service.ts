import prisma from '../../utils/prisma';
import { UserRoleEnum, UserStatus } from '@prisma/client';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createTaskIntoDb = async (userId: string, data: any) => {
  const result = await prisma.task.create({
    data: {
      ...data,
      userId: userId,

    },
  });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Task not created');
  }
  return result;
};

const getTaskListFromDb = async (userId: string, projectId: string) => {
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
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to view these tasks');
  }

  const result = await prisma.task.findMany({
    where: {
      projectId: projectId,
    },
  });

  return result;
};

const getTaskByIdFromDb = async (userId: string, taskId: string) => {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });

  if (!task) {
    throw new AppError(httpStatus.NOT_FOUND, 'Task not found');
  }

  const project = await prisma.project.findUnique({
    where: {
      id: task.projectId,
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
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to view this task');
  }

  return task;
};

const updateTaskIntoDb = async (userId: string, taskId: string, data: any) => {
  const result = await prisma.task.update({
    where: {
      id: taskId,
      userId: userId,
    },
    data: {
      ...data,
    },
  });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'taskId, not updated');
  }
  return result;
};

const deleteTaskItemFromDb = async (userId: string, taskId: string) => {
  const deletedItem = await prisma.task.delete({
    where: {
      id: taskId,
      userId: userId,
    },
  });
  if (!deletedItem) {
    throw new AppError(httpStatus.BAD_REQUEST, 'taskId, not deleted');
  }

  return deletedItem;
};

export const taskService = {
  createTaskIntoDb,
  getTaskListFromDb,
  getTaskByIdFromDb,
  updateTaskIntoDb,
  deleteTaskItemFromDb,
};
