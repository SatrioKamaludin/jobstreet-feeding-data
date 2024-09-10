import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import DeleteModal from './DeleteModal';
import UpdateModal from './UpdateModal';

export default function JobTable({
    jobs,
    handleUpdateClick,
    handleDeleteClick,
    jobToUpdate,
    jobToDelete,
    handleDeleteModalClose,
    handleUpdateModalClose,
    fetchJobs,
    showUpdateModal
}) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-gray-900">
                <thead className="bg-gray-300">
                    <tr>
                        <th className="py-2 px-4 text-center">Title</th>
                        <th className="py-2 px-4 text-center">Company Name</th>
                        <th className="py-2 px-4 text-center">Work Type</th>
                        <th className="py-2 px-4 text-center">Location</th>
                        <th className="py-2 px-4 text-center">Salary</th>
                        <th className="py-2 px-4 text-center">Listing Date</th>
                        <th className="py-2 px-4 text-center">Keyword</th>
                        <th className="py-2 px-4 text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="text-gray-900">
                    {jobs.map((job, index) => (
                        <tr key={index} className="border-b">
                            <td className="py-2 px-4">{job.title}</td>
                            <td className="py-2 px-4">{job.company_name}</td>
                            <td className="py-2 px-4">{job.work_type}</td>
                            <td className="py-2 px-4">{job.location}</td>
                            <td className="py-2 px-4">{job.salary}</td>
                            <td className="py-2 px-4">{format(new Date(job.listing_date), 'yyyy-MM-dd')}</td>
                            <td className="py-2 px-4">{job.keyword}</td>
                            <td className="py-2 px-4 flex">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    onClick={() => handleUpdateClick(job)}
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-2"
                                    onClick={() => handleDeleteClick(job)}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {jobToDelete && (
                        <DeleteModal
                            job={jobToDelete}
                            onClose={handleDeleteModalClose}
                            onDeleteSuccess={fetchJobs}
                        />
                    )}
                    {showUpdateModal && (
                        <UpdateModal
                            job={jobToUpdate}
                            onClose={handleUpdateModalClose}
                            onUpdateSuccess={fetchJobs}
                        />
                    )}
                </tbody>
            </table>
        </div>
    )
}