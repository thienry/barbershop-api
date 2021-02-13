import * as Yup from 'yup'

export const sessionStore = async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      email: Yup.string().required(),
      password: Yup.string().required()
    })

    await schema.validate(req.body, { abortEarly: false })

    return next()
  } catch (error) {
    return res.status(400).json({ error: 'Validation fails!', messages: error.inner })
  }
}
