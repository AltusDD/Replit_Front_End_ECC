import ApiProbe from './components/ApiProbe'

function App() {
  return (
    <div className="min-h-screen">
      <div className="container">
        <h1 className="text-center mb-8" style={{fontSize: '2.5rem', fontWeight: 'bold'}}>
          Empire Command Center
        </h1>
        <p className="text-center mb-8" style={{color: '#666'}}>
          Welcome to the Real Estate Management Application
        </p>
        <ApiProbe />
      </div>
    </div>
  )
}

export default App