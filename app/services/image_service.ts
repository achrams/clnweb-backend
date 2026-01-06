import { inject } from '@adonisjs/core'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { cuid } from '@adonisjs/core/helpers'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import fs from 'fs'

@inject()
export class ImageService {
  constructor(private ctx: HttpContext) {}

  async store(image: MultipartFile) {
    try {
      const request = this.ctx.request
      const hostUrl = String(request.protocol()).concat('://', String(request.host()))

      const imageName = `${cuid()}_${image.clientName.replace(' ', '_')}`,
        imageUrl = String(hostUrl).concat('/uploads/', imageName)

      await image.move(app.makePath('storage/uploads'), {
        name: imageName,
      })
      this.ctx.logger.info(image, 'New Image moved')
      return { imageUrl, imageName }
    } catch (error) {
      return error
    }
  }

  async delete(imageName: string) {
    try {
      const filePath = app.makePath('storage/uploads/').concat(imageName)
      fs.unlink(filePath, (err) => {
        if (err) throw err;
        this.ctx.logger.info(imageName, `${imageName} success deleted`)
        console.log(`${imageName} deleted`)
      })
    } catch (error) {
      return error
    }
  }
}
