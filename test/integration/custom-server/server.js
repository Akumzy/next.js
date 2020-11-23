const http = require('http')
const next = require('next')
const fs = require('fs')
const path = require('path')

const dev = process.env.NODE_ENV !== 'production'
const dir = __dirname
const port = process.env.PORT || 3000

const app = next({ dev, dir })
const handleNextRequests = app.getRequestHandler()

app.prepare().then(() => {
  const server = new http.Server(async (req, res) => {
    if (req.url === '/no-query') {
      return app.render(req, res, '/no-query')
    }

    if (/setAssetPrefix/.test(req.url)) {
      app.setAssetPrefix(`http://127.0.0.1:${port}`)
    } else if (/setEmptyAssetPrefix/.test(req.url)) {
      app.setAssetPrefix(null)
    } else {
      // This is to support multi-zones support in localhost
      // and may be in staging deployments
      app.setAssetPrefix('')
    }

    if (/test-index-hmr/.test(req.url)) {
      return app.render(req, res, '/index')
    }

    if (/dashboard/.test(req.url)) {
      return app.render(req, res, '/dashboard')
    }

    if (/local-image/.test(req.url)) {
      return app.render(req, res, '/local-image')
    }

    if (/static\/hello\.txt/.test(req.url)) {
      return app.render(req, res, '/static/hello.txt')
    }

    if (/uploads\/logo\.svg/.test(req.url)) {
      return renderFile(req, res, 'uploads/logo.svg')
    }

    if (/no-slash/.test(req.url)) {
      try {
        await app.render(req, res, 'dashboard')
      } catch (err) {
        res.end(err.message)
      }
    }

    handleNextRequests(req, res)
  })

  server.listen(port, (err) => {
    if (err) {
      throw err
    }

    console.log(`> Ready on http://localhost:${port}`)
  })
})

function renderFile(_req, res, pathname) {
  const filePath = path.join(__dirname, pathname)
  const stat = fs.statSync(filePath)

  res.writeHead(200, {
    'Content-Type': 'image/svg+xml',
    'Content-Length': stat.size,
  })

  const readStream = fs.createReadStream(filePath)
  readStream.pipe(res)
}
