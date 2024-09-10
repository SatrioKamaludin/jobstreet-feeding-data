// src/app/api.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/jobs';

export const getJobs = async (page = 1, pageSize = 10, search = '') => {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: {
        page,
        page_size: pageSize,
        search,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

export const addJob = async (data) => {
  try {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('company_name', data.company_name);
    formData.append('location', data.location);
    formData.append('salary', data.salary);
    formData.append('work_type', data.work_type);
    formData.append('keyword', data.keyword);

    const response = await axios.post(`${API_BASE_URL}/add`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding job:", error);
    throw error;
  }
}

export const updateJob = async (id, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}/update`, new URLSearchParams(data), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

export const deleteJob = async (jobId) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${jobId}/delete`);
    return response.data;
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};

export const downloadFile = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/export`, {
      responseType: 'blob', // Important for file downloads
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'jobs-export.xlsx'; // or the appropriate file name
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};