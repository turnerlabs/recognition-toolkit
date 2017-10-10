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
                <SearchResults></SearchResults>
            </div>
        );
    }
}

export default Homepage;
