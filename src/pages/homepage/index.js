import React, { Component }  from 'react';
import Helmet from 'react-helmet';
import SearchResults from '../../modules/search_results';

/**
 * Homepage
 */
class Homepage extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>Object Detection Model Tester</title>
                </Helmet>
                <h1>Object Detection Model Tester</h1>
                <SearchResults></SearchResults>
            </div>
        );
    }
}

export default Homepage;
