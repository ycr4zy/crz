import { Users } from '@prisma/client';

import { ConnectionEntity } from './connection.entity';
import { ConnectionService } from './connection.service';

export interface IConnectionRepository {
    connectionUsers: string[];

    update(id: number, value: any): unknown;

    create: (user: ConnectionEntity) => Promise<Users>;

    find: (steamId: string) => Promise<Users | null>;

}