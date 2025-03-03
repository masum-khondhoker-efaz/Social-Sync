import prisma from '../../utils/prisma';
import { UserRoleEnum, UserStatus } from '@prisma/client';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createUserSubscriptionIntoDb = async (
  userId: string,
  data: {
    subscriptionOfferId: string;
    paymentId: string;
  },
) => {
  return await prisma.$transaction(async prisma => {
    const subscriptionOffer = await prisma.subscriptionOffer.findUnique({
      where: {
        id: data.subscriptionOfferId,
      },
    });

    if (!subscriptionOffer) {
      throw new AppError(httpStatus.NOT_FOUND, 'Subscription offer not found');
    }

    const result = await prisma.userSubscription.create({
      data: {
        ...data,
        userId: userId,
      },
    });

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'userSubscription not created',
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isSubscribed: true,
      },
    });

    if (!updatedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User not updated');
    }

    const payment = await prisma.payment.create({
      data: {
        subscriptionOfferId: data.subscriptionOfferId,
        paymentId: data.paymentId,
        paymentAmount: subscriptionOffer.price,
      },
    });

    if (!payment) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Payment not created');
    }

    return result;
  });
};

const getUserSubscriptionListFromDb = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const result = await prisma.userSubscription.findMany({
    where: {
      userId: userId,
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          image: true,
        },
      },
      subscriptionOffer: {
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          creator: {
            select: {
              id: true,
              fullName: true,
              email: true,
              role: true,
              image: true,
            },
          },
        },
      },
    },
  });
  if (result.length === 0) {
    return { message: 'No userSubscription found' };
  }
  return result;
};

const getUserSubscriptionListByAdminFromDb = async () => {
  const result = await prisma.userSubscription.findMany({
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          image: true,
        },
      },
      subscriptionOffer: {
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          creator: {
            select: {
              id: true,
              fullName: true,
              email: true,
              role: true,
              image: true,
            },
          },
        },
      },
    },
  });
  if (result.length === 0) {
    return { message: 'No userSubscription found' };
  }
  return result;
};

const getUserSubscriptionByIdFromDb = async (userSubscriptionId: string) => {
  const result = await prisma.userSubscription.findUnique({
    where: {
      id: userSubscriptionId,
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          image: true,
        },
      },
      subscriptionOffer: {
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          creator: {
            select: {
              id: true,
              fullName: true,
              email: true,
              role: true,
              image: true,
            },
          },
        },
      },
    },
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'userSubscription not found');
  }
  return result;
};

const updateUserSubscriptionIntoDb = async (
  userId: string,
  userSubscriptionId: string,
  data: any,
) => {
  const existingSubscription = await prisma.userSubscription.findUnique({
    where: {
      id: userSubscriptionId,
      userId: userId,
    },
  });

  if (!existingSubscription) {
    throw new AppError(httpStatus.NOT_FOUND, 'userSubscription not found');
  }

  // If paymentStatus is SUCCESS
  if (data.paymentStatus === 'SUCCESS') {
    const subscriptionOffer = await prisma.subscriptionOffer.findUnique({
      where: {
        id: existingSubscription.subscriptionOfferId,
      },
    });

    if (!subscriptionOffer) {
      throw new AppError(httpStatus.NOT_FOUND, 'Subscription offer not found');
    }
  }

  // Update the userSubscription in the database
  const result = await prisma.userSubscription.update({
    where: {
      id: userSubscriptionId,
      userId: userId,
    },
    data: {
      ...data,
    },
  });

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'userSubscription not updated');
  }

  return result;
};

const deleteUserSubscriptionItemFromDb = async (userSubscriptionId: string) => {
  const deletedItem = await prisma.userSubscription.delete({
    where: {
      id: userSubscriptionId,
    },
  });
  if (!deletedItem) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'userSubscriptionId, not deleted',
    );
  }

  return deletedItem;
};

export const userSubscriptionService = {
  createUserSubscriptionIntoDb,
  getUserSubscriptionListFromDb,
  getUserSubscriptionListByAdminFromDb,
  getUserSubscriptionByIdFromDb,
  updateUserSubscriptionIntoDb,
  deleteUserSubscriptionItemFromDb,
};
