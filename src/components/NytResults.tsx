import React, {FunctionComponent} from 'react';

type AcceptedProps = {
    results: any,
    changePage: (event: {}, direction: string) => void;
};

const NytResults: FunctionComponent <(AcceptedProps)> = props => {

    console.log('props.results', props.results);

    return(
        <div>
        {props.results.map((result: any) => {
          return (
            <div key={result.index}>
              <h2>{result.headline.main}</h2>
              {result.multimedia.length > 1 ? <img alt="article" src={`http://www.nytimes.com/${result.multimedia[1].url}`} /> : ''}
              <p>
                {result.snippet}
                <br />
                {result.keywords.length > 0 ? ' Keywords: ' : ''}
              </p>
              <ul>
                {result.keywords.map((keyword: any) => <li key={keyword.value}>{keyword.value}</li>)}
              </ul>
              <a href={result.web_url}><button>Read It</button></a>
            </div>
          )
        })}
          <div>
              <button onClick={(e) => {e.preventDefault(); props.changePage(e, 'down')}}>Previous 10</button>
              <button onClick={(e) => {e.preventDefault(); props.changePage(e, 'up')}}>Next 10</button>
          </div>
      </div>
    );

};


export default NytResults;
