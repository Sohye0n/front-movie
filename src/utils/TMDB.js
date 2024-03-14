import axios from 'axios';

const API_KEY = "d2461ff4c38665609c69ea6a8e166a79";
const TOKEN="eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjQ2MWZmNGMzODY2NTYwOWM2OWVhNmE4ZTE2NmE3OSIsInN1YiI6IjY1OTE3ZTZhNGY5YTk5NzUyNjc3MzEzMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-y5avFuJfY55ga56YZ1qhgBovQzyMu2AlnZdy0bOTCE";

const fetchTVData = async (title, page) => {
  try {
    const response = await axios.get('https://api.themoviedb.org/3/search/tv', {
      params: {
        api_key: API_KEY,
        language:"en-US",
        page:page,
        query: title,
      },
    });
    return response.data;
  } catch (error){
    // API 호출이 실패하면 여기에서 에러를 처리합니다.
    console.error('API Error:', error);
    throw error;
  }
};


const fetchMovieData = async (title, page) => {
    try {
      const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
          api_key: API_KEY,
          language:"en-US",
          page:page,
          query: title,
        },
      });
      return response.data;
    } catch (error){
      // API 호출이 실패하면 여기에서 에러를 처리합니다.
      console.error('API Error:', error);
      throw error;
    }
};

const fetchMovieCreditData = async (id) => {
  console.log(id);
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits`, {
      params: {
        api_key: API_KEY,
        language:"en-US",
      },
    });
    return response.data;
  } catch (error){
    // API 호출이 실패하면 여기에서 에러를 처리합니다.
    console.error('API Error:', error);
    throw error;
  }
};

const fetchTvCreditData = async (id) => {
  console.log("tv!",id);
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}/credits`, {
      params: {
        api_key: API_KEY,
        language:"en-US",
      },
    });
    return response.data;
  } catch (error){
    // API 호출이 실패하면 여기에서 에러를 처리합니다.
    console.error('API Error:', error);
    throw error;
  }
};

export default {
    fetchTVData,
    fetchMovieData,
    fetchMovieCreditData,
    fetchTvCreditData
};
