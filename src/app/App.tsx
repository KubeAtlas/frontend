import { LoginPage } from '../pages/login/ui/LoginPage'
import { LocaleProvider } from '../shared/lib/locale/LocaleContext'

function App() {
  return (
    <LocaleProvider>
      <LoginPage />
    </LocaleProvider>
  )
}

export default App
