import React, {Component} from 'react';
import NytResults from "./NytResults";

type testState = {
    search: string,
    startDate: string,
    endDate: string,
    pageNumber: number,
    results: []
};

class NytApp extends Component<{}, testState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            search: "",
            startDate: "",
            endDate: "",
            pageNumber: 0,
            results: []
        };

        this.fetchResults = this.fetchResults.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changePageNumber = this.changePageNumber.bind(this);

    };

    fetchResults = () => {

        const baseURL:string = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
        const key:string | undefined | null = process.env.REACT_APP_NYT_API_KEY;

        let url:string = `${baseURL}?api-key=${key}&page=${this.state.pageNumber}&q=${this.state.search}`;
        url = this.state.startDate ? url + `&begin_date=${this.state.startDate}` : url;
        url = this.state.endDate ? url + `&end_date=${this.state.endDate}` : url;
    
        fetch(url)
          .then(res => res.json())
          .then(data => this.setState({results: data.response.docs}))
          .catch(err => console.log(err));
        
    };

    handleSubmit = (event: {}) => {

        this.setState({pageNumber: 0});
        this.fetchResults();
      };

    changePageNumber = (event: {}, direction: string): void => {

        if (direction === 'down') {
          if (this.state.pageNumber  > 0) {
            this.setState({pageNumber: this.state.pageNumber - 1});
            this.fetchResults();
          };
        };
        if (direction === 'up') {
            this.setState({pageNumber: this.state.pageNumber + 1});
            this.fetchResults();
        };
      };

    componentDidMount() {

        this.fetchResults();

      };


    render() {

        return(
            <div className="main">
            <div className="mainDiv">
              <form onSubmit={(e) => {e.preventDefault(); this.handleSubmit(e)}}>
                <span>Enter a single search term (required) : </span>
                <input type="text" name="search" onChange={(e) => this.setState({search: e.target.value})} required />
                <br />
                <span>Enter a start date: </span>
                <input type="date" name="startDate" pattern="[0-9]{8}" onChange={(e) => this.setState({startDate: e.target.value})} />
                <br />
                <span>Enter an end date: </span>
                <input type="date" name="endDate" pattern="[0-9]{8}" onChange={(e) => this.setState({endDate: e.target.value})} />
                <br />
                <button className="submit">Submit search</button>
              </form>
              {this.state.results.length > 0 ? <NytResults results={this.state.results} changePage={this.changePageNumber} /> : null}
            </div>
          </div>
        );
    };
};

export default NytApp;