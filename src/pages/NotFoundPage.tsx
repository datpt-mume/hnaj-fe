import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="glass-card p-8 text-center">
      <p className="text-5xl">(＞﹏＜)</p>
      <h1 className="mt-2 font-display text-3xl text-ink">404 - Lạc mất trang rồi</h1>
      <p className="mt-2 text-sm text-[#6f668d]">Trang bạn tìm không tồn tại hoặc đã đổi địa chỉ.</p>
      <Link to="/" className="mt-4 inline-block">
        <Button>Về trang chủ</Button>
      </Link>
    </div>
  )
}
