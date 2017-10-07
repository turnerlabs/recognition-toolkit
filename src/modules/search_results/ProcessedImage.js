import React, { Component }  from 'react';
import axios from 'axios';
import styles from './styles.css';

class ProcessedImage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            images: null
        }
        this.setImage = this.setImage.bind(this);
    }

    setImage(url) {
        var _this = this;
        this.serverRequest = axios({
            method: 'post',
            url: 'http://object-detection-api.prod.services.ec2.dmtio.net/detect',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                url: url
            }
        })
        .then((response) => {
            console.log(response)
            _this.setState({
                image: <img src={response.data.image} className={styles.image}></img>
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    componentDidMount() {
        this.setImage(this.props.data)
    }

    componentWillReceiveProps(nextProps) {
        this.setImage(nextProps.data)
    }

    componentWillUnmount() {
        this.serverRequest.abort();
    }

    render() {
        return (
            <div className={styles['image-box']}>
                {this.state.image}
            </div>
        )
    }
}

export default ProcessedImage;