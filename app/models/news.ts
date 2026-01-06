import { DateTime } from 'luxon'
import { BaseModel, beforeDelete, beforeSave, beforeUpdate, column } from '@adonisjs/lucid/orm'
import slugify from '../utils/slugify.js'
import fs from 'fs'
import app from '@adonisjs/core/services/app'

export default class News extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare slug: string

  @column.date()
  declare post_date: DateTime

  @column()
  declare img_url: string

  @column()
  declare img_name: string

  @column()
  declare img_figure: string

  @column()
  declare desc: string

  @column()
  declare source: string

  @column()
  declare published?: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  @beforeUpdate()
  static async generateSlug(news: News) {
    if (news.$dirty.title) {
      news.slug = slugify(news.title)
    }
  }

  @beforeDelete()
  static async deleteImage(news: News) {
    try {
      const filePath = app.makePath('storage/uploads/').concat(news.img_name);
      fs.unlink(filePath, (err) => {
        if (err) throw err;
        console.log(`${news.img_name} deleted`);
      })
    } catch (error) {
      console.log(error)
      return error
    }
  }
}
