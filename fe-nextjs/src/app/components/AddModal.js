import { useState } from "react"
import { addJob } from "../api/api"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle, faSpinner } from "@fortawesome/free-solid-svg-icons"

export default function AddModal({ onClose, onAddSuccess }) {
    const [title, setTitle] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [location, setLocation] = useState("")
    const [salary, setSalary] = useState("")
    const [workType, setWorkType] = useState("")
    const [keyword, setKeyword] = useState("")
    const [loading, setLoading] = useState(false)
    const [addSuccess, setAddSuccess] = useState(false)

    const isFormValid = title && companyName && location && salary && workType && keyword;

    const handleAdd = async () => {
        setLoading(true)
        try {
            await addJob({
                title,
                company_name: companyName,
                location,
                salary,
                work_type: workType,
                keyword,
            })
            setAddSuccess(true)
            onAddSuccess()
        } catch (error) {
            console.error("Error deleting job:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div role="dialog" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                {addSuccess ? (
                    <div className="flex flex-col items-center">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-4xl" />
                        <p className="mt-4 text-lg font-bold text-green-500">Job Added Successfully!</p>
                        <button
                            className="bg-transparent text-green-500 font-bold px-4 py-2 rounded-md hover:text-white hover:bg-green-600 mt-4"
                            onClick={onClose}
                        >
                            OK
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className="text-lg font-semibold mb-4 text-black">Add Job</h2>
                        <div className="space-y-4">
                            <div className="flex items-center mb-4">
                                <label htmlFor="title" className="w-36 text-gray-700 font-medium mr-4 text-right">Title:</label>
                                <input
                                    id="title"
                                    type="text"
                                    placeholder="Enter job title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md w-60 text-black" // Consistent width for fields
                                />
                            </div>
                            <div className="flex items-center mb-4">
                                <label htmlFor="companyName" className="w-36 text-gray-700 font-medium mr-4 text-right">Company Name:</label>
                                <input
                                    id="companyName"
                                    type="text"
                                    placeholder="Enter company name"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
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
                                <label htmlFor="salary" className="w-36 text-gray-700 font-medium mr-4 text-right">Salary:</label>
                                <input
                                    id="salary"
                                    type="text"
                                    placeholder="Enter salary"
                                    value={salary}
                                    onChange={(e) => setSalary(e.target.value)}
                                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md w-60 text-black" // Consistent width for fields
                                />
                            </div>
                            <div className="flex items-center mb-4">
                                <label htmlFor="workType" className="w-36 text-gray-700 font-medium mr-4 text-right">Work Type:</label>
                                <input
                                    id="workType"
                                    type="text"
                                    placeholder="Enter work type"
                                    value={workType}
                                    onChange={(e) => setWorkType(e.target.value)}
                                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md w-60 text-black" // Consistent width for fields
                                />
                            </div>
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
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                className={`text-white px-4 py-2 rounded-md ${isFormValid ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400'}`}
                                onClick={handleAdd}
                                disabled={loading || !isFormValid}
                            >
                                {loading ? (
                                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                                ) : 'Add'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}