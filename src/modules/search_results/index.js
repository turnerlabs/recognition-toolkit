import React, { Component }  from 'react';
import axios from 'axios';
import styles from './styles.css';
import ProcessedImage from './ProcessedImage.js';

class SearchResults extends Component {

    constructor(props) {
        super(props)
        let spinner = 'http://www.pngmart.com/files/4/Batman-Fidget-Spinner-PNG-Transparent.png';
        this.spinner = <img className={styles.spinner} src={spinner}/>
        this.apis = {
            santa: 'http://object-detection-api.prod.services.ec2.dmtio.net/detect',
            snoopy: 'http://object-detection-api.prod-scooby.services.ec2.dmtio.net/detect'
        };
        this.state = {
            images: this.spinner,
            search: 'santa clause',
            api: 'santa'
        }
        this.updateSearch = this.updateSearch.bind(this);
        this.searchImages = this.searchImages.bind(this);
        this._handleKeyPress = this._handleKeyPress.bind(this);
        this._handleOptionChange = this._handleOptionChange.bind(this);
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
                    return <ProcessedImage
                                key={index}
                                data={image.url}
                                api={_this.apis[this.state.api]}>
                    </ProcessedImage>;
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

    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.searchImages();
        }
    }

    _handleOptionChange(event) {
        this.setState({
            api: event.target.value
        });
    }

    render() {
        return (
            <div className={styles['images-box']}>
                <div className={styles.inputs}>
                    <input type="text"
                       value={this.state.search}
                       onKeyPress={this._handleKeyPress}
                       onChange={this.updateSearch}/>
                    <input type="button"
                        onClick={this.searchImages}
                        value="Search"></input>
                    <div className={styles.radios}>
                        <div className="radio">
                            <label>
                            <input type="radio"
                                name="api"
                                value="santa"
                                onChange={this._handleOptionChange}
                                defaultChecked/>
                            Santa
                            </label>
                        </div>
                        <div className="radio">
                            <label>
                            <input type="radio"
                                name="api"
                                value="snoopy"
                                onChange={this._handleOptionChange}/>
                            Snoopy
                            </label>
                        </div>
                    </div>
                    <div className={styles['images-box']}>
                        {this.state.images}
                    </div>
                </div>
            </div>
        )
    }
}

export default SearchResults;