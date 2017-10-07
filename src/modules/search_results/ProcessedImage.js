import React, { Component }  from 'react';
import styles from './styles.css';
// import axios from 'axios';

class ProcessedImage extends Component {
    state = {
        image: null
    }

    componentDidMount() {
        var _this = this;
        _this.setState({
            image: <img src={this.props.data} className={styles.image}></img>
        });
        // var _this = this;
        // this.serverRequest = axios.get('/search?q=santa%20clause')
        // .then((response) => {
        //     _this.setState({
        //         images: response.data.map((image) => {
        //             return <ProcessedImage data={image.url}></ProccessedImage>;
        //         })
        //     });
        // })
        // .catch((error) => {
        //     console.log(error);
        // });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            image: <img src={nextProps.data} className={styles.image}></img>
        });
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