import {observer} from 'mobx-react-lite'
import ChatView from './views/chatView'


const App: React.FC = observer(() => {

  return (
    <div>
      <ChatView />
    </div>
  )
})

export default App
