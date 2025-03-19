import './App.css'
import { TableView } from './components/ui/tableView'
import mock from "./mock.json";

function App() {



  return (
    <div className='bg-gray-800' >
      <TableView items={mock.items} />
    </div>
  )
}

export default App
