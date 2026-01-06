import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'news'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.string('slug').unique().notNullable()
      table.date('post_date').notNullable()
      table.string('img_url').notNullable()
      table.string('img_name').notNullable()
      table.string('img_figure').notNullable()
      table.text('desc').notNullable()
      table.string('source').notNullable()
      table.boolean('published').defaultTo(true).notNullable();
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}