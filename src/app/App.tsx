import { LoginPageTest } from '../pages/login/ui/LoginPageTest'
import { LocaleProvider } from '../shared/lib/locale/LocaleContext'

function App() {
  return (
    <LocaleProvider>
      <LoginPageTest />
    </LocaleProvider>
  )
}

export default App
