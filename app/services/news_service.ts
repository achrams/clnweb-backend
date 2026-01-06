import News from '#models/news'
import { inject } from '@adonisjs/core'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { DateTime } from 'luxon'
import { ImageService } from './image_service.js'

export type CreateNewsType = {
  published?: boolean | undefined
  title: string
  post_date: Date
  image: MultipartFile
  img_figure: string
  desc: string
  source: string
}

export type UpdateNewsType = {
  title?: string | undefined
  post_date?: Date | undefined
  image?: MultipartFile | undefined
  img_figure?: string | undefined
  desc?: string | undefined
  source?: string | undefined
  published?: boolean | undefined
}

export type PaginationType = {
  page: number
  limit: number
}
@inject()
export class NewsService {
  constructor(private imageService: ImageService) {}

  async list({ limit, page }: PaginationType) {
    const totalData = await News.query().count('* as total')
    const total = totalData[0].$extras.total

    const data = await News.query()
      .offset((page - 1) * limit)
      .limit(limit)
      .where('published', true)

    const totalPage = Math.ceil(total / limit)
    return { data, totalPage, total }
  }
  async all({ limit, page }: PaginationType) {
    const totalData = await News.query().count('* as total')
    const total = totalData[0].$extras.total

    const data = await News.query()
      .offset((page - 1) * limit)
      .limit(limit)

    const totalPage = Math.ceil(total / limit)
    return { data, totalPage, total }
  }

  async detailSlug(slug: string) {
    try {
      return News.query().whereILike('slug', `%${slug}%`).first()
    } catch (error) {
      throw error
    }
  }

  async create(payload: CreateNewsType) {
    try {
      const { image } = payload
      const { imageUrl, imageName } = await this.imageService.store(image)

      const news = await News.create({
        title: payload.title,
        img_url: imageUrl,
        img_name: imageName,
        img_figure: payload.img_figure,
        desc: payload.desc,
        published: payload.published ?? true,
        post_date: DateTime.fromJSDate(payload.post_date),
        source: payload.source,
      })

      return news
    } catch (error) {
      return error
    }
  }

  detail(id: number) {
    return News.findOrFail(id)
  }

  async update(payload: UpdateNewsType, id: number) {
    try {
      const news = await News.findOrFail(id)
      console.log(payload)

      if (payload.image instanceof MultipartFile) {
        // New image

        //* Delete old image
        await this.imageService.delete(news.img_name)
        //* store new image
        const { imageUrl, imageName } = await this.imageService.store(payload.image)
        news.img_url = imageUrl
        news.img_name = imageName
      }

      for (const key in payload) {
        const value = payload[key]
        if (value) {
          news[key] = value
        }
      }

      if (payload.post_date) {
        news.post_date = DateTime.fromJSDate(payload.post_date)
      }

      await news.save()
      return news
    } catch (error) {
      console.log(error)
      return error
    }
  }

  async edit(payload: { published: boolean }, id: number) {
    try {
      const news = await News.findOrFail(id)
      news.merge(payload)
      return await news.save()
    } catch (error) {
      return error
    }
  }

  async delete(id: number) {
    try {
      const news = await News.findOrFail(id)
      await news.delete()
      // console.log({news})
      return news
    } catch (error) {
      return error
    }
  }
}
