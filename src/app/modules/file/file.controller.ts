import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { fileService } from './file.service';
import AppError from '../../errors/AppError';
import { uploadFileToSpace } from '../../utils/multerUpload';
import { uploadFileToSpaceForUpdate } from '../../utils/updateMulterUpload';

const createFile = catchAsync(async (req, res) => {
  const user = req.user as any;
  const data = req.body;
  const file = req.file;

  if (!file) {
    throw new AppError(httpStatus.CONFLICT, 'file not found');
  }
  const fileUrl = await uploadFileToSpace(file, 'project-files');

  const fileData = {
    data,
    fileUrl: fileUrl,
    size: (file.size / (1024 * 1024)).toFixed(2), // Convert size to MB
  };
  const result = await fileService.createFileIntoDb(user.id, fileData);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'File created successfully',
    data: result,
  });
});

const getFileList = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await fileService.getFileListFromDb(user.id, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'File list retrieved successfully',
    data: result,
  });
});

const getFileById = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await fileService.getFileByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'File details retrieved successfully',
    data: result,
  });
});

const updateFile = catchAsync(async (req, res) => {
  const fileId = req.params.fileId;
  const user = req.user as any;
  const data = req.body;
  const file = req.file;

  let fileData: { data: any; fileUrl?: string; size?: string } = { data };

  if (file) {
    const fileLink = await uploadFileToSpaceForUpdate(file, 'project-files');
    fileData.fileUrl = fileLink;
    fileData.size = (file.size / (1024 * 1024)).toFixed(2).toString(); // Convert size to MB
  }
  const result = await fileService.updateFileIntoDb(user.id, fileId, fileData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'File updated successfully',
    data: result,
  });
});

const deleteFile = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await fileService.deleteFileItemFromDb(user.id, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'File deleted successfully',
    data: result,
  });
});

export const fileController = {
  createFile,
  getFileList,
  getFileById,
  updateFile,
  deleteFile,
};
