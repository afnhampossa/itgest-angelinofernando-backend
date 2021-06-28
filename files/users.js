module.exports = (app, connection) => {
  app.get('/users', (req, res) => {
    const { page, limit } = req.query

    connection.query('SELECT COUNT(*) FROM users', (error, results) => {
      if (error) {
        throw error
      }

      const count = results[0]['COUNT(*)']

      const _limit = Number(limit)
      const _page = Number(page)

      const offset = (_page - 1) * _limit

      connection.query('SELECT * FROM users LIMIT ?, ?', [offset, _limit], (error, results, _) => {
        if (error) {
          throw error
        }

        const pages = Math.ceil(count / limit)

        res.send({
          code: 200,
          meta: {
            pagination: {
              total: count,
              pages: pages,
              page: _page,
            }
          },
          data: results,
        })
      })
    })
  })

  app.get('/users/:id', (req, res) => {
    const { id } = req.params

    connection.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id], (error, results, _) => {
      if (error) {
        throw error
      }

      res.send(results[0])
    })
  })

  app.post('/users', (req, res) => {
    const user = req.body

    connection.query('INSERT INTO users SET ?', [user], (error, results, _) => {
      if (error) {
        throw error
      }

      const { insertId } = results

      connection.query('SELECT * FROM users WHERE id = ? LIMIT 1', [insertId], (error, results, _) => {
        if (error) {
          throw error
        }

        res.send(results[0])
      })
    })
  })

  app.put('/users/:id', (req, res) => {
    const { id } = req.params

    const user = req.body

    connection.query('UPDATE users SET ? WHERE id = ?', [user, id], (error, results, _) => {
      if (error) {
        throw error
      }

      connection.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id], (error, results, _) => {
        if (error) {
          throw error
        }

        res.send(results[0])
      })
    })
  })

 
}
