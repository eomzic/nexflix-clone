import { useEffect} from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import {
    getSearchMovie,
    getSearchShows,
    IGetMovieResult,
    IGetShowResult,
} from "../api";
import NotFound from "../Components/NotFound";
import SearchResult from "../Components/SearchResult";

const Wrapper = styled.div`
  background-color: black;
`;
const Loader = styled.div`
  height: 20vh;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SlideWrap = styled.div`
  margin-top: 5em;
`;
const SlideTitle = styled.h2`
  font-size: 2rem;
  font-family: 600;
  margin-bottom: 1rem;
  padding-left: 1rem;
`;

function Search() {
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");

    const {
        data: searchMovie,
        isLoading: loadSearchMovie,
        refetch: refetchMovie,
    } = useQuery<IGetMovieResult>(["search", "searchMovie"], () =>
        getSearchMovie(keyword)
    );
    const {
        data: searchShows,
        isLoading: loadSearchShows,
        refetch: refetchShows,
    } = useQuery<IGetShowResult>(["search", "searchShow"], () =>
        getSearchShows(keyword)
    );
    useEffect(() => {
        if (keyword === null || "") {
            return;
        }
        refetchMovie();
        refetchShows();
    }, [keyword]);
    return (
        <Wrapper>
            {loadSearchMovie && loadSearchShows ? (
                <Loader>Loading...</Loader>
            ) : searchMovie?.total_results === 0 ||
            searchShows?.total_results === 0 ? (
                <NotFound />
            ) : (
                <>
                    <SlideWrap>
                        <SlideTitle>영화 검색 결과</SlideTitle>
                        <SearchResult
                            data={searchMovie}
                            category="search"
                            type="movie"
                            url="search"
                        />
                    </SlideWrap>
                    <SlideWrap>
                        <SlideTitle>TV 시리즈 검색 결과</SlideTitle>
                        <SearchResult
                            data={searchShows}
                            category="search"
                            type="tv"
                            url="search"
                        />
                    </SlideWrap>
                </>
            )}
        </Wrapper>
    );
}
export default Search;
