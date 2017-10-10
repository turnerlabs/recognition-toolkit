import { Component } from 'react';
import axios from 'axios';
/**
 * A component used for fetching data.
 *
 * Provided a callback function, as children, allows the composer to determine
 * how to present the returned data visually.
 *
 * @example
 * ```
 * <FetchData
 *      uri="/v1/thing"
 *      interval={1000 * 30}
 * >
 *      {(error, data) => (data && (
 *          <pre>{JSON.stringify(data, null, 2)}</pre>
 *      )) || null}
 * </FetchData>
 * ```
 *
 * @param {String} uri
 *  A URI endpoint to fetch.
 *
 * @param {Function} children
 *  Callback function that determines how to render the data.
 *
 * @param {Number} [interval]
 *  Defines an interval in which data should be fetched.
 *
 * @param {Function} [transform]
 *  Transforms data before being returned.
 */
class FetchData extends Component {
    constructor(props) {
        super(props);
        this.state = { data: null, error: null, isLoading: false };
        this.fetch = this.fetch.bind(this);
        this.doImperativeWork = this.doImperativeWork.bind(this);
    }
    componentWillMount() {
        const { uri, interval } = this.props;
        this.doImperativeWork(uri, interval);
    }
    componentWillReceiveProps({ uri, interval }) {
        const { uri: currentURI, interval: currentInterval } = this.props;
        const newURI = uri !== currentURI;
        const newInterval = interval !== currentInterval;
        if (newURI || newInterval) {
            this.doImperativeWork(uri, interval);
        }
    }
    componentDidUpdate() {
        if (this.props.onDataRendered && this.state.data !== null && this.state.error === null) {
            this.props.onDataRendered();
        }
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    doImperativeWork(uri, interval) {
        // check to make sure we have the required data to fetch.
        if (!uri) { return; }
        this.setState({ data: null, error: null }, () => {
            if (interval) {
                clearInterval(this.interval);
                this.interval = setInterval(this.fetch, interval, uri);
            }
            this.fetch(uri);
        });
    }
    fetch(uri) {

        this.setState({
            isLoading: true
        });
        // Fetch data
        axios.get(uri)
            .then((response) => {
                this.setState({
                    isLoading: false,
                    data: response.data
                });
            })
            .catch((error) => {
                if (error.constructor === Error) {
                    throw error;
                }
                if (error.response) {
                    // The request was made, but the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
                if (error.status >= 400) {
                    this.setState({
                        isLoading: false,
                        error: error.status
                    });
                }
            });
    }
    render() {
        const { children } = this.props;
        const { error, data } = this.state;
        return children(error, data);
    }
}
export default FetchData;