// import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common';
// import * as xlsx from 'xlsx';

// @Injectable()
// export class ParseXlsxPipe implements PipeTransform<Express.Multer.File> {
//     transform(file: Express.Multer.File, metadata: ArgumentMetadata){
//         if(!file) throw new BadRequestException('No file found!')
//         let originFileName = file.originalname.split(".")
//         if(!originFileName.length || originFileName.length < 2)
//             throw new BadRequestException('Extension invalid')
//         if(originFileName.pop() !== 'xlsx')
//             throw new BadRequestException('Invalid extension xlsx')

//         let data = {}

//         let buffer = xlsx.read(file.buffer, {type: "buffer"})

//         buffer.SheetNames.map(sheetName => {
//             data[sheetName] = xlsx.utils.sheet_to_json(buffer.Sheets[sheetName]);
//         });

//         return data
//     }
// }