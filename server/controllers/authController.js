import User from '../models/User.js'

// Xử lý đăng ký
export const register = async (req, res) => {
  try {
    const { name, email, password, birthdate } = req.body

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'Email đã tồn tại' })
    }

    const user = new User({ name, email, password, birthdate })
    await user.save()

    res.status(201).json({ message: 'Đăng ký thành công', user })
  } catch (err) {
    console.error('❌ Đăng ký lỗi:', err)
    res.status(500).json({ message: 'Lỗi server' })
  }
}

// Xử lý đăng nhập
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Sai email hoặc mật khẩu' })
    }

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      name: user.name
    })
  } catch (err) {
    console.error('❌ Đăng nhập lỗi:', err)
    res.status(500).json({ success: false, message: 'Lỗi server' })
  }
}
