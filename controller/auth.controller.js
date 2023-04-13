const { db } = require('../database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body
//     const isEmailExist = await db.execute(
//       `SELECT * FROM users WHERE email=${db.escape(email)}`
//     )
//     if (isEmailExist.length == 0) {
//       return res.status(200).send({ message: 'Email or Password is Invalid' })
//     }
//
//     const isValid = await bcrypt.compare(password, isEmailExist[0].password)
//
//     if (!isValid) {
//       return res.status(200).send({ message: 'Email or Password is incorrect' })
//     }
//
//     let payload = {
//       id: isEmailExist[0].id_user,
//     }
//
//     const token = jwt.sign(payload, 'group08', { expiresIn: '1h' })
//
//     return res.status(200).send({
//       message: 'Login Success',
//       token,
//       data: {
//         id: isEmailExist[0].id_user,
//         email: isEmailExist[0].email,
//         username: isEmailExist[0].username,
//         phone: isEmailExist[0].phone,
//         name: isEmailExist[0].store_name,
//       },
//     })
//   } catch (error) {
//     // console.log('LOG.e', error.message)
//     res.status(error.status || 500).send(error.message)
//   }
// }

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const [rows] = await db.execute('SELECT * FROM users WHERE email=?', [
      email,
    ])
    if (rows.length === 0) {
      res.status(401).json({ message: 'Invalid email or password' })
      return
    }
    const user = rows[0]
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid email or password' })
      return
    }

    // check token login
    let payload = {
      id: user.id_user,
    }
    const token = jwt.sign(payload, 'group08', { expiresIn: '1h' })

    // If we get here, the email and password are valid
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id_user,
        email: user.email,
        username: user.username,
        phone: user.phone,
        storeName: user.store_name,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred while logging in' })
  }
}

module.exports = { login }