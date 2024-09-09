// src/app/api.js

import axios from 'axios';

export async function downloadFile() {
  try {
    const response = await axios({
      url: 'http://localhost:8000/api/jobs/export',
      method: 'GET',
      responseType: 'blob', // Important for file downloads
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jobs-export.xlsx'; // or the appropriate file name
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
}
