import { useState } from "react";
import classes from "./App.module.css";

function App() {

  const [state, setState] = useState({
    userName: '',
    repo: '',
    loading: false,
    error: null,
  });

  // Fetch the repositories from the api using the username from search input
  const getRepos = async () => {
    setState(previousState => ({...previousState, loading: true, error: null}));

    try {
      const res = await fetch(`https://api.github.com/users/${state.userName}/repos`)
      if (!res.ok) {
        throw new Error('User Not Found');
      }
      const data = await res.json();
      if (data.length === 0) {
        throw new Error('User Not Found');
      }
      const filteredByFork = data.filter(repo => !repo.fork)
      const mostStarredRepo = filteredByFork.sort((a,b) => b.stargazers_count - a.stargazers_count)[0];
      setState(previousState => ({...previousState, repo: mostStarredRepo, loading: false}));
    }
    catch (error) {
      setState(previousState => ({...previousState, loading: false, error: error.message, repos: []}));
    }
  }

  // Handlers for tracking input change and request submission

  const handleChange = (e) => {
    setState(previousState => ({...previousState, userName: e.target.value}));

  }

  const handleSearchClick = () => {
    setState(previousState => ({...previousState, repo: null}));
    if (state.userName !== '') {
      getRepos()
    }
  }

  return (
    <>
      <section className={classes.form}>
        <header><strong>Github Repository Finder</strong></header>
        <input aria-label="UsernameInput" type="text" value={state.userName} onChange={handleChange} name='userName' placeholder='Enter username'/>
        <button aria-label="SubmitButton" onClick={handleSearchClick}>{state.loading ? 'Loading...' : 'Search'}</button>
      </section>

      {state.error && <h1>An error has occured: {state.error}</h1>}
      <ul className={classes.list}>
        {state.repo && (
          <article>
            <a href={state.repo.html_url} target="_blank" rel="noreferrer">
              <h2>{state.repo.name}</h2>
            </a>
            <p><strong>Description: </strong>{state.repo.description}</p>
            <p><strong>Language: </strong> {state.repo.language}</p>
          </article>
        )}
      </ul>      
    </>
  );
}

export default App;
