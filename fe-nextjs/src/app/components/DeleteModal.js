import { useState } from "react"
import { deleteJob } from "../api/api"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle, faSpinner } from "@fortawesome/free-solid-svg-icons"

export default function DeleteModal({ job, onClose, onDeleteSuccess }) {
    const [loading, setLoading] = useState(false)
    const [deleted, setDeleted] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        try {
            await deleteJob(job.id)
            setDeleted(true)
            setLoading(false)
            onDeleteSuccess()
        } catch (error) {
            console.error("Error deleting job:", error)
            setLoading(false)
        }
    }
    return (
        <div role="dialog" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                {deleted ? (
                    <div className="flex flex-col items-center">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-4xl" />
                        <p className="mt-4 text-lg font-bold text-green-500">Job Deleted Successfully!</p>
                        <button
                            className="bg-transparent text-green-500 font-bold px-4 py-2 rounded-md hover:text-white hover:bg-green-600 mt-4"
                            onClick={onClose}
                        >
                            OK
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="text-lg font-semibold mb-4">
                            Are you sure you want to delete this job?
                        </p>
                        <p className="text-sm text-gray-700 mb-4">
                            {job.title} - {job.company_name}
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                                onClick={onClose}
                            >
                                No
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 rounded-md hover:bg-red-600"
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                {loading ? (
                                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                                ) : null}
                                Yes
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}