import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class MySqlLoaderService {
  private basePath = join(process.cwd(), 'sql-queries');

  async load(subfolder: string, filename: string): Promise<string> {
    return readFile(join(this.basePath, subfolder, filename), {
      encoding: 'utf-8',
    });
  }
}
