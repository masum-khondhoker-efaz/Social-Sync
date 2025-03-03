import express from 'express';
import { UserRouters } from '../modules/user/user.routes';
import { AuthRouters } from '../modules/auth/auth.routes';
import path from 'path';
// import { PaymentRoutes } from '../modules/payment/payment.routes';
import { NotificationRoutes } from '../modules/Notification/Notification.routes';
import { mapRoutes } from '../modules/map/map.routes';
import { projectRoutes } from '../modules/project/project.routes';
import { supervisorRoutes } from '../modules/supervisor/supervisor.routes';
import { taskRoutes } from '../modules/task/task.routes';
import { teamRoutes } from '../modules/team/team.routes';
import { projectMemberAddRoutes } from '../modules/projectMemberAdd/projectMemberAdd.routes';
import { teamAssignedRoutes } from '../modules/teamAssigned/teamAssigned.routes';
import { teamMemberRoutes } from '../modules/teamMember/teamMember.routes';
import { fileRoutes } from '../modules/file/file.routes';
const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRouters,
  },
  {
    path: '/users',
    route: UserRouters,
  },
  
  // {
  //   path: '/payments',
  //   route: PaymentRoutes,
  // },
  {
    path: '/maps',
    route: mapRoutes,
  },
  {
    path: '/projects',
    route: projectRoutes,
  },
  {
    path: '/notifications',
    route: NotificationRoutes,
  },
  {
    path: '/supervisors',
    route: supervisorRoutes,
  },
  {
    path: '/projects',
    route: projectRoutes,
  },
  {
    path: '/tasks',
    route: taskRoutes,
  },
  {
    path: '/teams',
    route: teamRoutes,
  },
  {
    path: '/project-member-assign',
    route: projectMemberAddRoutes,
  },
  {
    path: '/team-member-assign',
    route: teamMemberRoutes,
  },
  {
    path: '/team-assign',
    route: teamAssignedRoutes,
  },
  {
    path: '/files',
    route: fileRoutes,
  },
  
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
