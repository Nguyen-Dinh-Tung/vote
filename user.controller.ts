// import { PUBLIC_FILE_UPLOAD_PATH } from '../../common/environments';
// import {
//   Controller,
//   HttpException,
//   HttpStatus,
//   Post,
//   UploadedFile,
//   UseInterceptors,
// } from '@nestjs/common';
// import { AnyFilesInterceptor } from '@nestjs/platform-express';
// import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
// import { diskStorage, MulterError } from 'multer';
// import { extname } from 'path';
// import { Auth } from 'src/auth/decorator/auth.decorator';
// import { User } from 'src/auth/decorator/user.decorator';
// import { MAX_FILE_SIZE } from 'src/app-module/file-upload/file-upload.controller';
// import { UserService } from './user.service';

// @ApiBearerAuth()
// @ApiTags('users')
// @Controller('users')
// @Auth()
// export class UserController {
//   constructor(private readonly userService: UserService) {}

//   @Post('me/avatar-upload')
//   @UseInterceptors(
//       AnyFilesInterceptor({
//         storage: diskStorage({
//           destination: `./public${PUBLIC_FILE_UPLOAD_PATH}`,
//           filename: (req, file, callback) => {
//             const fileName = `avatar-user-${Date.now()}${extname(
//                 file.originalname,
//             )}`;
//             callback(null, fileName);
//             file.filename = fileName;
//             req.file = file;
//           },
//         }),
//         limits: {
//           fileSize: MAX_FILE_SIZE,
//         },
//         fileFilter(req, file, callback) {
//           const maxFileSizeInBytes = 2000000;
//           const fileSize = parseInt(req.headers['content-length']);
//           const mineType = file.mimetype;
//           if (fileSize > maxFileSizeInBytes) {
//             return callback(new MulterError('LIMIT_FILE_SIZE'), false);
//           }
//           if (!mineType.includes('image')) {
//             return callback(
//                 new HttpException(
//                     { message: 'Image only' },
//                     HttpStatus.BAD_REQUEST,
//                 ),
//                 false,
//             );
//           }

//           callback(null, true);
//         },
//       }),
//   )
//   @ApiConsumes('multipart/form-data')
//   @ApiBody({
//     schema: {
//       type: 'object',
//       properties: {
//         file: { type: 'string', format: 'binary' },
//       },
//     },
//   })
//   async uploadAvatar(
//       @UploadedFile() file: Express.Multer.File,
//       @User('id') userId: number,
//   ): Promise<any> {
//     return this.userService.updateAvatar(userId, file);
//   }
// }
