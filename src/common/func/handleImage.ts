import * as fs from 'fs';
export const saveImage = (file: Express.Multer.File) => {
  const filename = file.filename;
  const path = file.path;
  const type = file.mimetype.split('/').pop().toLowerCase();
  const fileSave = `${process.env.STATICIMG + filename}${Date.now()}.${type}`;
  const buffer = fs.readFileSync(file.path);
  fs.writeFileSync(`.${fileSave}`, buffer);
  fs.unlinkSync(path);
  return fileSave;
};
export const removeFile = (path: string) => {
  fs.unlinkSync(path);
};
