import * as fs from 'fs';
export const saveImage = (file: Express.Multer.File) => {
  let filename = file.filename;
  let path = file.path;
  let type = file.mimetype.split('/').pop().toLowerCase();
  let fileSave = `${process.env.STATICIMG + filename}${Date.now()}.${type}`;
  let buffer = fs.readFileSync(file.path);
  fs.writeFileSync(`.${fileSave}`, buffer);
  fs.unlinkSync(path);
  return fileSave;
};
export const removeFile = (path: string) => {
  fs.unlinkSync(path);
};
