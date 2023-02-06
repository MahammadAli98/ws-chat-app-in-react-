import Room from './components/room'

export default function App() {
  return (
    <div className="App">
      <h4>websocket</h4>
      <h5>Group: <span id="group">Underground</span></h5>
      <Room />
    </div>
  )
}