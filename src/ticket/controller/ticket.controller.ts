import { Controller, Get, Post, Body, Patch, Param, Delete , Headers } from '@nestjs/common';
import { RolesCheck } from 'src/common/decorator/roles.guard';
import { Roles } from 'src/common/enum/role.enum';
import getUserByReq from 'src/common/func/getUserByHeaderReq';
import { UsersService } from 'src/users/services/users.service';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { DataFindByAny } from '../dto/Find-Ticket.dto';
import { UpdateTicketDto } from '../dto/update-ticket.dto';
import { TicketService } from '../services/ticket.service';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService ,
    private readonly usersService : UsersService
    ) {}

  @RolesCheck([Roles.admin , Roles.content])
  @Post()
  async create(@Body() createTicketDto: CreateTicketDto , @Headers() headers : any) {
    // return this.ticketService.create(createTicketDto , getUserByReq(headers));
  }

  @RolesCheck([...Object.values(Roles)])
  @Get()
  async findAll() {
    return this.ticketService.findAll();
  }

  @RolesCheck([...Object.values(Roles)])
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ticketService.findOne(id);
  }

  @RolesCheck([...Object.values(Roles)])
  @Post('find')
  async findOneByAny(@Body() data : DataFindByAny){
    // return this.ticketService.findOneByAny(data)
  }

  @RolesCheck([Roles.admin , Roles.content])
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketService.update(+id, updateTicketDto);
  }

  @RolesCheck([Roles.admin , Roles.content])
  @Delete(':id')
  async remove(@Param('id') id: string , @Headers() headers : any) {
    // return this.ticketService.remove(id , getUserByReq(headers));
  }
}
