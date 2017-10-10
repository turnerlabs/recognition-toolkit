import React, { Component }  from 'react';
import axios from 'axios';
import styles from './styles.css';
import ProcessedImage from './ProcessedImage.js';

class SearchResults extends Component {

    constructor(props) {
        super(props)
        let spinner = 'http://www.pngmart.com/files/4/Batman-Fidget-Spinner-PNG-Transparent.png';
        this.spinner = <img className={styles.spinner} src={spinner}/>
        this.state = {
            images: this.spinner,
            search: 'santa clause'
        }
        this.updateSearch = this.updateSearch.bind(this);
        this.searchImages = this.searchImages.bind(this);
    }

    updateSearch(event) {
        this.setState({search: event.target.value});
    }

    searchImages() {
        var _this = this;
        this.setState({
            images: _this.spinner
        });
        this.serverRequest = axios.get('/search?q=' + _this.state.search)
        .then((response) => {
            _this.setState({
                images: response.data.map((image, index) => {
                    console.log(image)
                    return <ProcessedImage key={index} data={image.url}></ProcessedImage>;
                })
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    componentDidMount() {
        this.searchImages();
    }

    componentWillUnmount() {
        this.serverRequest.abort();
    }

    render() {
        return (
            <div className={styles['images-box']}>
                <input type="text" value={this.state.search} onChange={this.updateSearch}/>
                <input type="button" onClick={this.searchImages} value="Search"></input>
                <div className={styles['images-box']}>
                    {this.state.images}
                </div>
            </div>
        )
    }
}

export default SearchResults;