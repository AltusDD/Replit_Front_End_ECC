import ApiProbe from './components/ApiProbe'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Empire Command Center
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Welcome to the Real Estate Management Application
        </p>
        <ApiProbe />
      </div>
    </div>
  )
}

export default App