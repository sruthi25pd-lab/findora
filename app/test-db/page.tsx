import { createClient } from '../../utils/supabase/server'

export default async function TestDbPage() {
  const supabase = await createClient()

  // Make a simple query to verify connection
  // We fetch the current user to verify the auth client is working
  const { data, error } = await supabase.auth.getUser()

  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      {error && error.message !== 'Auth session missing!' ? (
        <div className="bg-red-100 p-4 rounded text-red-800">
          <p><strong>Error connecting:</strong> {error.message}</p>
        </div>
      ) : (
        <div className="bg-green-100 p-4 rounded text-green-800">
          <p><strong>Connection successful!</strong></p>
          <pre className="mt-4 bg-gray-100 text-gray-900 p-4 rounded overflow-auto border border-gray-300">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
