import { useState, type FormEvent } from 'react'
import { Modal } from '../../components/common/Modal'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuth } from './use-auth'
import { useToast } from '../../components/common/use-toast'

export function AuthModal() {
  const { showToast } = useToast()
  const { isAuthModalOpen, closeAuthModal, authModalMode, openAuthModal, loginAction, registerAction } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setSubmitting(true)
      if (authModalMode === 'login') {
        await loginAction({ email, password })
      } else {
        await registerAction({ name, email, password })
      }

      setName('')
      setEmail('')
      setPassword('')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Không thể xử lý xác thực.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={isAuthModalOpen} title={authModalMode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'} onClose={closeAuthModal}>
      <div className="mb-4 flex rounded-full bg-cream p-1">
        <button
          type="button"
          className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold ${
            authModalMode === 'login' ? 'bg-white text-ink' : 'text-[#8278a4]'
          }`}
          onClick={() => openAuthModal('login')}
        >
          Đăng nhập
        </button>
        <button
          type="button"
          className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold ${
            authModalMode === 'register' ? 'bg-white text-ink' : 'text-[#8278a4]'
          }`}
          onClick={() => openAuthModal('register')}
        >
          Đăng ký
        </button>
      </div>

      <form className="space-y-3" onSubmit={onSubmit}>
        {authModalMode === 'register' ? (
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Tên hiển thị" maxLength={255} />
        ) : null}

        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="email@example.com"
          required
        />
        <Input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Mật khẩu tối thiểu 8 ký tự"
          minLength={8}
          maxLength={255}
          required
        />

        <Button fullWidth disabled={submitting}>
          {submitting ? 'Đang xử lý...' : authModalMode === 'login' ? 'Vào app thôi' : 'Tạo tài khoản'}
        </Button>
      </form>
    </Modal>
  )
}
