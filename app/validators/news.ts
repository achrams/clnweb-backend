import vine from '@vinejs/vine'

export const createNewsValidator = vine.compile(
  vine.object({
    title: vine.string().trim(),
    post_date: vine.date(),
    image: vine.file({
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'svg', 'webp'],
    }),
    img_figure: vine.string().trim(),
    desc: vine.string().trim(),
    source: vine.string().trim(),
    published: vine.boolean().optional(),
  })
)

export const updateNewsValidator = vine.compile(
  vine.object({
    title: vine.string().trim().optional(),
    post_date: vine.date().optional(),
    image: vine.file({
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'svg', 'webp'],
    }).optional(),
    image_url: vine.string().trim().optional(),
    img_figure: vine.string().trim().optional(),
    desc: vine.string().trim().optional(),
    source: vine.string().trim().optional(),
    published: vine.boolean().optional(),
  })
)

export const patchUpdatePublishNews = vine.compile(
  vine.object({
    published: vine.boolean(),
  })
)
