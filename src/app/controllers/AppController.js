import path from 'path'

class AppController {
  index (req, res) {
    return res.sendFile(path.join(__dirname, '..', '..', '..', 'public', 'index.html'))
  }
}

export default new AppController()
