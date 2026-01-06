import { NewsService } from '#services/news_service'
import { createNewsValidator, patchUpdatePublishNews, updateNewsValidator } from '#validators/news'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class NewsController {
  constructor(private newsService: NewsService) {}

  async list({ request, response }: HttpContext) {
    try {
      const page = Number(request.input('page', 1))
      const limit = Number(request.input('limit', 20))
      const { data, total, totalPage } = await this.newsService.list({ limit, page })
      return response.ok({
        page,
        limit,
        total_data: Number(total),
        total_page: Number(totalPage),
        data: data,
      })
    } catch (error) {
      return error
    }
  }

  async detailSlug({ request, response }: HttpContext) {
    try {
      const slug = request.param('slug', '').trim()
      if (!slug) {
        return response.badRequest({ error: 'Slug is required' })
      }
      const detailSlug = await this.newsService.detailSlug(slug)
      return detailSlug
    } catch (error) {
      return error
    }
  }
  async index({ request, response }: HttpContext) {
    try {
      const page = Number(request.input('page', 1))
      const limit = Number(request.input('limit', 20))
      const { data, total, totalPage } = await this.newsService.all({ limit, page })
      return response.ok({
        page,
        limit,
        total_data: Number(total),
        total_page: Number(totalPage),
        data: data,
      })
    } catch (error) {
      return error
    }
  }

  async detail({ params }: HttpContext) {
    try {
      const id = params.id
      return this.newsService.detail(id)
    } catch (error) {
      return error
    }
  }

  async store({ request }: HttpContext) {
    try {
      console.log(request.all())
      const payload = await request.validateUsing(createNewsValidator)
      const news = await this.newsService.create(payload)
      return news
    } catch (error) {
      return error
    }
  }

  @inject()
  async update({ request, params }: HttpContext) {
    try {
      const id = params.id
      const payload = await request.validateUsing(updateNewsValidator)
      const news = await this.newsService.update(payload, id)
      return news
    } catch (error) {
      return error
    }
  }

  async edit({ request, params }: HttpContext) {
    try {
      const id = params.id
      const payload = await request.validateUsing(patchUpdatePublishNews)
      return this.newsService.edit(payload, id)
    } catch (error) {
      return error
    }
  }

  async delete({ params }: HttpContext) {
    try {
      await this.newsService.delete(params.id)
      return 1
    } catch (error) {
      return error
    }
  }
}
