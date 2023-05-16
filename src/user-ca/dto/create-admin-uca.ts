import { Roles } from 'src/common/enum/role.enum';

export class CreateAdminUcaDto {
  idCandidate: string;
  idUser: string;
  role: Roles;
}
