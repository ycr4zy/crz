import { inject, injectable } from 'inversify';

import Types from './types';

import 'reflect-metadata';

@injectable()
export class App {
    constructor(
    ) {
    }

    public async init(): Promise<void> {
    }
}