import React, { Suspense } from "react";
import {
  defer,
  Await
} from "react-router-dom";
import Spinner from "./Spinner";
import { searchMovies } from "../api.js";
import AllMovies from "./AllMovies";
import { Empty, Error } from "./utilities";

function getMovies (search) {
  const turnOut1 = searchMovies(search, 1);
  const turnOut2 = searchMovies(search, 2);
  
  const data = Promise.all([ turnOut1, turnOut2 ])
  return defer({ data })
}

const SearchMovies = (props) => {
  const { search } = props;
  const moviesData = getMovies(search);
  const deferredMovies = moviesData.data.data;

  //console.log(deferredMovies);
  const renderMovies = (loadedMovies) => {
    
    let movieBox = null;
    
    if (loadedMovies[0].pages > 1) {
      movieBox = [
        ...loadedMovies[0].results, 
        ...loadedMovies[1].results
      ];
    } else {
      movieBox = loadedMovies[0].results;
    }
 
    if (movieBox.length === 0) return <Empty />;
    try {
      const movies = AllMovies(movieBox);
      return movies;
    } catch (error) {
      console.log(error)
      return <Error />;
    } 
  }
  
  return (
    <header className="container">
    <Suspense fallback={<Spinner />}>
      <Await resolve={deferredMovies}>
        {renderMovies}
      </Await>
    </Suspense>
    </header>
  )
}

export default SearchMovies;
