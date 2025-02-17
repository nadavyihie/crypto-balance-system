import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FileService {
  async readJson<T>(filePath: string): Promise<T> {
    try {
      const data = await fs.readFile(path.resolve(filePath), 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await this.writeJson(filePath, []);
        return [] as any;
      }
      throw error;
    }
  }

  async writeJson<T>(filePath: string, data: T): Promise<void> {
    await fs.writeFile(path.resolve(filePath), JSON.stringify(data, null, 2));
  }
} 