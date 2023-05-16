import { addTransactionalDataSource } from 'typeorm-transactional/dist/common';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
export const missGrandOptionConfig = {
  type: 'mysql',
  port: 3306,
  username: 'root',
  password: '123123',
  database: 'missgrand',
  host: 'localhost',
};

const dataSource = new DataSource({
  type: 'mysql',
  host: '3306',
  username: 'root',
  password: '123123',
});

initializeTransactionalContext();
addTransactionalDataSource(dataSource);
