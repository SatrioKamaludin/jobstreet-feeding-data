import { useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons"
import { scrapeJob } from "../api/api"

export default function ScrapeModal({ onClose, onScrapeSuccess }) {
    const [location, setLocation] = useState("")
    const [keyword, setKeyword] = useState("")
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [scrapeSuccess, setScrapeSuccess] = useState(false)
    const [scrapMessages, setScrapMessages] = useState("")
    const [scrapeStarted, setScrapeStarted] = useState(false)
    const controllerRef = useRef(null)

    const isFormValid = location && keyword && page;

    const handleScrape = async () => {
        setLoading(true)
        setScrapeStarted(true)
        try {
            controllerRef.current = new AbortController();
            const result = await scrapeJob(
                location,
                keyword,
                page,
                { signal: controllerRef.current.signal }
            )
            setScrapMessages(result.message)
            setScrapeSuccess(true)
            onScrapeSuccess()
        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("Error scraping:", error)
            }
        } finally {
            setLoading(false)
            setScrapeStarted(false)
        }
    }

    const handleCancel = () => {
        if (!scrapeStarted) {
            onClose()
        } else if (controllerRef.current) {
            controllerRef.current.abort()
            setScrapeStarted(false)
            setLoading(false)
        }
        onScrapeSuccess()
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                {scrapeSuccess ? (
                    <div className="flex flex-col items-center">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-4xl" />
                        <p className="mt-4 text-lg font-bold text-green-500">{scrapMessages}</p>
                        <button
                            className="bg-transparent text-green-500 font-bold px-4 py-2 rounded-md hover:text-white hover:bg-green-600 mt-4"
                            onClick={onClose}
                        >
                            OK
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className="text-lg font-semibold mb-4 text-black">Scrape from Jobstreet</h2>
                        <div className="space-y-4">
                            <div className="flex items-center mb-4">
                                <label htmlFor="keyword" className="w-36 text-gray-700 font-medium mr-4 text-right">Keyword:</label>
                                <input
                                    id="keyword"
                                    type="text"
                                    placeholder="Enter keywords"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md w-60 text-black" // Consistent width for fields
                                />
                            </div>
                            <div className="flex items-center mb-4">
                                <label htmlFor="location" className="w-36 text-gray-700 font-medium mr-4 text-right">Location:</label>
                                <input
                                    id="location"
                                    type="text"
                                    placeholder="Enter location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md w-60 text-black" // Consistent width for fields
                                />
                            </div>
                            <div className="flex items-center mb-4">
                                <label htmlFor="page" className="w-36 text-gray-700 font-medium mr-4 text-right">Page:</label>
                                <input
                                    id="page"
                                    type="number"
                                    placeholder="Enter page"
                                    value={page}
                                    onChange={(e) => setPage(e.target.value)}
                                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md w-60 text-black" // Consistent width for fields
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button
                                className={`text-white px-4 py-2 rounded-md ${isFormValid ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400'}`}
                                onClick={handleScrape}
                                disabled={loading || !isFormValid}
                            >
                                {loading ? (
                                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                                ) : 'Start Scraping'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}