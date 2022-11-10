import fs from 'fs';

export const deleteFile = (filePath: string) => {
  fs.unlink(filePath, (error: Error | null) => {
    if (error) {
      throw error;
    }
  });
}
