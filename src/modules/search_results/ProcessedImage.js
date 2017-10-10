import React, { Component }  from 'react';
import axios from 'axios';
import styles from './styles.css';

class ProcessedImage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            image: null,
            error: null
        }
        this.setImage = this.setImage.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
    }

    setImage(url, api) {
        var _this = this;
        _this.setState({
            image: <img className={styles.image} src={url}/>
        });
        this.serverRequest = axios({
            method: 'post',
            url: api,
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 30000,
            data: {
                url: url
            }
        })
        .then((response) => {
            if (response.data.code && response.data.code !== 200) {
                _this.setState({
                    image: ''
                });
                console.log('error', response);
                return;
            }
            _this.setState({
                image: <img src={response.data.image}
                            className={styles.image}/>
            });
        })
        .catch((error) => {
            _this.setState({
                image: '',
                error: error
            });
        });
    }

    componentDidMount() {
        this.setImage(this.props.data, this.props.api)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.data === nextProps.data && this.props.api === nextProps.api) return;
        this.setImage(nextProps.data)
    }

    // componentWillUnmount() {
    //     if (!this.serverRequest) return;
    //     this.serverRequest.abort();
    // }

    render() {
        return (
            <div className={styles['image-box']}>
                {this.state.image}
            </div>
        )
    }
}

export default ProcessedImage;