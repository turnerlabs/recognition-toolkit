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

    setImage(url) {
        var _this = this;
        _this.setState({
            image: <img className={styles.image} src={url}/>
        });
        this.serverRequest = axios({
            method: 'post',
            url: 'http://object-detection-api.prod.services.ec2.dmtio.net/detect',
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 30000,
            data: {
                url: url
            }
        })
        .then((response) => {
            console.log(response)
            _this.setState({
                image: <img src={response.data.image} className={styles.image}></img>,
                isLoading: false
            });
        })
        .catch((error) => {
            console.log(error);
            _this.setState({
                image: '',
                error: error
            });
        });
    }

    componentDidMount() {
        this.setImage(this.props.data)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.data === nextProps.data) return;
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