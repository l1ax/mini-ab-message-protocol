import {observer} from 'mobx-react-lite'
import ChatView from './views/chatView'
import './App.css'

const App: React.FC = observer(() => {
  return (
    <div className="app-container">
      <div className="app-main">
        <ChatView />
      </div>
    </div>
  )
})

export default App
