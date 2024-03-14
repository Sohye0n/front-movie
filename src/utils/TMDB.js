import axios from 'axios';

const API_KEY = "";
const TOKEN="";

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
