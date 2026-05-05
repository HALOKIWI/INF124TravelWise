import AuthShell from '../components/AuthShell.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  return (
    <AuthShell
      mode="login"
      title="Log In"
      cta="start planning"
      onSubmit={({ email, password }) => login(email, password)}
    />
  )
}
