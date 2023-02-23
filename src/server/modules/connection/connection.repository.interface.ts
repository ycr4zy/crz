import { Users } from '@prisma/client';

import { ConnectionEntity } from './connection.entity';

export interface IConnectionRepository {

    create: (user: ConnectionEntity) => Promise<Users>;

    find: (steamId: string) => Promise<Users | null>;

}