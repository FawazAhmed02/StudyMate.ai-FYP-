const API_BASE_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/student/login`,
    REGISTER: `${API_BASE_URL}/student/register`,
    FORGOT_PASSWORD: `${API_BASE_URL}/student/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/student/reset-password`,
    GENERATE_QUIZ: `${API_BASE_URL}/quiz/generate`,
    GENERATE_NOTES: `${API_BASE_URL}/notes/generate`,
    VIDEO_SUMMARY: `${API_BASE_URL}/video/summarize`,
    SUBMIT_QUIZ: `${API_BASE_URL}/quiz/submit`,
    DASHBOARD_DATA: `${API_BASE_URL}/dashboard/dashboard-data`,
};

export default API_BASE_URL;