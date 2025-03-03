import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { mapService } from './map.service';
import AppError from '../../errors/AppError';
import { uploadFileToSpace } from '../../utils/multerUpload';
import { uploadFileToSpaceForUpdate } from '../../utils/updateMulterUpload';

const createMap = catchAsync(async (req, res) => {
  const user = req.user as any;
  const data = req.body;
  const file = req.file;

  if (!file) {
    throw new AppError(httpStatus.CONFLICT, 'file not found');
  }

  if (file.mimetype !== 'application/pdf') {
    throw new AppError(httpStatus.UNSUPPORTED_MEDIA_TYPE, 'Only PDF files are allowed');
  }

  const fileSize = file.size as number;
  const fileUrl = await uploadFileToSpace(file, 'skippy');

  const mapData = {
    data,
    mapImage: fileUrl,
    fileSize,
  };

  const result = await mapService.createMapIntoDb(user.id, mapData);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Map created successfully',
    data: result,
  });
});

const getMapList = catchAsync(async (req, res) => {
  const user = req.user as any;
  const { search } = req.query;
  const searchString = search as string;
  const result = await mapService.getMapListFromDb(user.id, searchString);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Map list retrieved successfully',
    data: result,
  });
});

const getMapById = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await mapService.getMapByIdFromDb(user.id, req.params.mapId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Map details retrieved successfully',
    data: result,
  });
});

const updateMap = catchAsync(async (req, res) => {
  const user = req.user as any;
  const data = req.body;
  const file = req.file;

  if (!file) {
    throw new AppError(httpStatus.CONFLICT, 'file not found');
  }

  if (file.mimetype !== 'application/pdf') {
    throw new AppError(
      httpStatus.UNSUPPORTED_MEDIA_TYPE,
      'Only PDF files are allowed',
    );
  }

  const fileSize = file.size.toString();
  

  let mapData: { data: any; mapImage?: string; fileSize: string } = { data, fileSize };

  if (file) {
    const fileUrl = await uploadFileToSpaceForUpdate(
      file,
      'skippy',
    );
    mapData.mapImage = fileUrl;
  }
  const result = await mapService.updateMapIntoDb(
    user.id,
    req.params.mapId,
    mapData,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Map updated successfully',
    data: result,
  });
});

const deleteMap = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await mapService.deleteMapItemFromDb(
    user.id,
    req.params.mapId,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Map deleted successfully',
    data: result,
  });
});

export const mapController = {
  createMap,
  getMapList,
  getMapById,
  updateMap,
  deleteMap,
};