// import { NotifyApp } from './notify-app.entity';
// import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// import { UserEntity } from 'src/users/entities/user.entity';

// @Entity({
//     name : 'extrano'   
// })
// export class ExtraNoEntity {
//     @PrimaryGeneratedColumn('uuid')
//     id : string ;

//     @ManyToOne(() => NotifyApp , (notify) => notify.id)
//     @JoinColumn()
//     notify :  NotifyApp;

//     @ManyToOne(() => UserEntity , (user) => user.id)
//     @JoinColumn()
//     user : UserEntity ;
    
//     @Column({
//         default : true
//     })
//     isActive : boolean ;
//     @Column({
//         type : 'datetime' ,
//         default :() => 'CURRENT_TIMESTAMP'
//     })
//     timeAt : Date ;
//     @Column({
//         type : 'timestamp' ,
//         default :() => 'CURRENT_TIMESTAMP'
//     })
//     timeOut : string ;
//     @Column({
//         default : 'Default'
//     })
//     historyCreate  : string ;
//     @Column({
//         default : 'This is active'
//     })
//     historyChange : string ;

// }