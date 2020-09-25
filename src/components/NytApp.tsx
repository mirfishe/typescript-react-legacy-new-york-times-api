import React, {Component} from 'react';
import NytResults from "./NytResults";

type testState = {
    search: string,
    startDate: string,
    endDate: string,
    pageNumber: number,
    // results: any,
    // resultDataItem: {},
    resultData: resultDataItem[]
};

type resultDataItem = {
  index: string,
  headlineMain: string,
  multimediaURL: string,
  snippet: string,
  keywords: string[]
  web_url: string
};

class NytApp extends Component<{}, testState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            search: "",
            startDate: "",
            endDate: "",
            pageNumber: 0,
            // results: [],
            // resultDataItem: {
            //   index: "",
            //   headlineMain: "",
            //   snippet: "",
            //   web_url: ""
            // },
            resultData: []
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
          .then(data => {
            // this.setState({results: data.response.docs});

            console.log('data', data);
            // console.log('data.length', data.length);

            // console.log('data.response.docs', data.response.docs);
            // console.log('data.response.docs.length', data.response.docs.length);

            // local array of objects to replace values in resultList
            // let resultDataItems: {index: string,
            //   headlineMain: string,
            //   snippet: string,
            //   web_url: string}[] = [];

            // let resultDataItems: {resultDataItem: resultDataItem}[] = [];
            let resultDataItems: resultDataItem[] = [];

            let resultDataItem: resultDataItem;

            let arrKeywords: string[] = [];
            let multimediaLink: string = "";

            for (let i = 0; i < data.response.docs.length; i++) {
              // this.setState({resultDataItem: {
              //   index: data.response.docs[i]._id,
              //   headlineMain: data.response.docs[i].headline.main,
              //   snippet: data.response.docs[i].snippet,
              //   web_url: data.response.docs[i].web_url
              // }})

              arrKeywords = [];
              // console.log('data.response.docs[i].keywords', data.response.docs[i].keywords);
              // console.log('data.response.docs[i].keywords.length', data.response.docs[i].keywords.length);
              for (let j = 0; j < data.response.docs[i].keywords.length; j++) {
                arrKeywords.push(data.response.docs[i].keywords[j].value);
              };
              // console.log('arrKeywords', arrKeywords);

              multimediaLink = "";
              // console.log('data.response.docs[i].multimedia', data.response.docs[i].multimedia);
              // console.log('data.response.docs[i].multimedia.length', data.response.docs[i].multimedia.length);
              // for (let j = 0; j < data.response.docs[i].multimedia.length; j++) {
              //   if (j === 0) {
              //   multimediaLink = data.response.docs[i].multimedia[j].url;
              //   break;
              //   };
              // };
              if (data.response.docs[i].multimedia.length > 0) {
                multimediaLink = data.response.docs[i].multimedia[0].url;
              };
              // console.log('multimediaLink', multimediaLink);

              resultDataItem = {
                  index: data.response.docs[i]._id,
                  headlineMain: data.response.docs[i].headline.main,
                  multimediaURL: multimediaLink,
                  snippet: data.response.docs[i].snippet,
                  keywords: arrKeywords,
                  web_url: data.response.docs[i].web_url
                };

              resultDataItems.push(resultDataItem);

              // console.log('this.state.resultDataItem', this.state.resultDataItem);

              // push to an array
              // resultDataItems.push({
              //   index: data.response.docs[i]._id,
              //   headlineMain: data.response.docs[i].headline.main,
              //   snippet: data.response.docs[i].snippet,
              //   web_url: data.response.docs[i].web_url
              // });

              // console.log('index', data.response.docs[i]._id);
              // console.log('headlineMain', data.response.docs[i].headline.main);
              // console.log('snippet', data.response.docs[i].snippet);
              // console.log('web_url', data.response.docs[i].web_url);

          };

          // console.log('resultDataItems', resultDataItems);

          // setState of that array with the local array
          this.setState({resultData: resultDataItems});

          })
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

        // console.log("this.state.pageNumber", this.state.pageNumber);
      };

    componentDidMount() {

        // this.fetchResults();

      };

    componentDidUpdate() {

        // this.fetchResults();

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
              {/* {this.state.results.length > 0 ? <NytResults results={this.state.results} changePage={this.changePageNumber} /> : null} */}
              {this.state.resultData.length > 0 ? <NytResults resultData={this.state.resultData} changePage={this.changePageNumber} /> : null}
            </div>
          </div>
        );
    };
};

export default NytApp;