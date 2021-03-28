import Upload from '../models/Upload'

class UploadController {
  async store (req, res) {
    const {
      originalname: name,
      filename: path = '',
      mimetype: type,
      location: s3 = '',
      size
    } = req.file

    const file = await Upload.create({
      name,
      path,
      size,
      type,
      s3
    })

    return res.json(file)
  }
}

export default new UploadController()
