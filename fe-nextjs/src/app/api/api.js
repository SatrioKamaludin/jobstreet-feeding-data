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