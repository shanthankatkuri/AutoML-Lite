import { useState } from "react"

export default function QueryDataset({ filePath }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("http://localhost:5000/query_dataset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_path: filePath, query })
      })

      const data = await res.json()

      if (data.error) {
        setError(data.error)
        setResults([])
      } else {
        setResults(data.result || [])
      }
    } catch (err) {
      setError("Failed to query dataset")
      setResults([])
    }

    setLoading(false)
  }

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-semibold mb-2">Query Dataset</h2>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Ask something in English..."
        className="border p-2 w-full mb-2"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Run Query
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {!loading && results.length > 0 && (
        <table className="w-full mt-4 table-auto border">
          <thead>
            <tr>
              {Object.keys(results[0]).map(key => (
                <th key={key} className="border px-2 py-1">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((val, j) => (
                  <td key={j} className="border px-2 py-1">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
