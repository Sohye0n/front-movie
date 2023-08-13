import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosRequestHeaders,
  } from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/',
});


axiosInstance.interceptors.request.use(
    function (config) {
    console.log("interceptor is running");
    // 토큰을 로컬 스토리지나 쿠키에서 가져옵니다.
    const accessToken = localStorage.getItem('accessToken');

    // 토큰이 있다면 헤더에 추가합니다.
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
    },
    function (error) {
    return Promise.reject(error);
    }
);

export default axiosInstance;