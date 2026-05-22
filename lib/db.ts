import { setDefaultResultOrder } from 'dns';
setDefaultResultOrder('ipv4first');

import prisma from './prisma';

export const db = prisma;

export default prisma;
