import { useState } from 'react'

interface ProbeResult {
  status: 'idle' | 'loading' | 'success' | 'error'
  response?: any
  error?: string
  timestamp?: string
}

export default function ApiProbe() {
  const [result, setResult] = useState<ProbeResult>({ status: 'idle' })
  const [endpoint, setEndpoint] = useState('/api/health')

  const probeApi = async () => {
    setResult({ status: 'loading' })
    
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.text()
      let parsedData = data
      
      try {
        parsedData = JSON.parse(data)
      } catch {
        // Keep as text if not JSON
      }

      if (response.ok) {
        setResult({
          status: 'success',
          response: parsedData,
          timestamp: new Date().toLocaleTimeString()
        })
      } else {
        setResult({
          status: 'error',
          error: `HTTP ${response.status}: ${response.statusText}`,
          response: parsedData,
          timestamp: new Date().toLocaleTimeString()
        })
      }
    } catch (error) {
      setResult({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toLocaleTimeString()
      })
    }
  }

  const getStatusColor = () => {
    switch (result.status) {
      case 'success': return 'text-green-600'
      case 'error': return 'text-red-600'
      case 'loading': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusText = () => {
    switch (result.status) {
      case 'success': return '✅ Success'
      case 'error': return '❌ Error'
      case 'loading': return '⏳ Loading...'
      default: return '⚪ Ready'
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">API Probe</h2>
      <p className="text-gray-600 mb-6">Test API connectivity to staging environment</p>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="endpoint" className="block text-sm font-medium mb-2">
            API Endpoint
          </label>
          <input
            id="endpoint"
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="/api/endpoint"
          />
        </div>

        <button
          onClick={probeApi}
          disabled={result.status === 'loading'}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {result.status === 'loading' ? 'Probing...' : 'Probe API'}
        </button>

        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Status</h3>
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          
          {result.timestamp && (
            <p className="text-sm text-gray-500 mb-2">
              Last probe: {result.timestamp}
            </p>
          )}

          {result.error && (
            <div className="mb-3">
              <h4 className="font-medium text-red-600 mb-1">Error:</h4>
              <p className="text-sm text-red-700 bg-red-50 p-2 rounded">
                {result.error}
              </p>
            </div>
          )}

          {result.response && (
            <div>
              <h4 className="font-medium mb-1">Response:</h4>
              <pre className="text-sm bg-white p-3 border rounded overflow-auto max-h-40">
                {typeof result.response === 'string' 
                  ? result.response 
                  : JSON.stringify(result.response, null, 2)
                }
              </pre>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500">
          <p><strong>Target:</strong> empirecommandcenter-altus-staging.azurewebsites.net</p>
          <p><strong>Proxy:</strong> Requests to /api/* are proxied through Vite</p>
        </div>
      </div>
    </div>
  )
}