import { DataSource } from 'typeorm'
export = new DataSource({
  type: 'sqlite',
  database: 'test.sqlite',
  entities: ['**/*.entity.ts'],
  migrations: [`${__dirname}/migrations/*.ts`]
})
