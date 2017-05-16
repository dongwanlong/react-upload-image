import React, { PropTypes } from 'react';
import cx from 'classnames';
import uuidV1 from 'uuid/v1';
import './react-upload-image.scss';

class ReactUploadImage extends React.Component {

    constructor() {
        super();
        this.state = {
            imgList: [],
            viewImg: {
                isShow: false,
                path: '',
                style: {}
            }
        };
        this.handChange = this.handChange.bind(this);
        this.viewImg = this.viewImg.bind(this);
        this.deleteImg = this.deleteImg.bind(this);
        this.getImgInfo = this.getImgInfo.bind(this);
        this.closeImg = this.closeImg.bind(this);
    }

    handChange(e) {
        const { beforeUpload, fileChange } = this.props;
        this.getImgInfo(e).then(list => {
            if (beforeUpload && !beforeUpload(list)) return;
            list.forEach(item=>{
                this.pushImg(item);
            });
            fileChange(list);
        }
        );
    };

    pushImg(value) {
        let { imgList } = this.state;
        imgList.push(value);
        this.setState({
            imgList: imgList,
        });
    };

    getImgInfo(e) {
        const fileArray = Array.from(e.target.files);

        let promiseArray = fileArray.map((value, index, arr)=>{
            return new Promise((resolve, reject)=>{
                let reader = new FileReader();
                reader.onload = ev => {
                let image = new Image();
                image.src = ev.target.result;
                image.onload = function () {
                    resolve({
                        width: image.width,
                        height: image.height,
                        src: ev.target.result,
                        size: ev.total,
                        key: uuidV1(),
                    });
                }
                }
                reader.readAsDataURL(value);
            });
        });
        return Promise.all(promiseArray);
    }

    closeImg() {
        this.setState({
            viewImg: {
                isShow: false,
            }
        });
    }

    viewImg(value) {
        let rateSize = value.height / value.width;
        let width = value.width > 600 ? 600 : value.width;
        let height = width * rateSize;
        this.setState({
            viewImg: {
                isShow: true,
                path: value.src,
                style: {
                    width: width,
                    height: height,
                }
            }
        });
    }

    deleteImg(value) {
        let { imgList } = this.state;
        let index = imgList.findIndex((item, index, arr)=>{
            return value.key == item.key;
        })
        imgList.splice(index,1);
        this.setState({
            imgList: imgList,
        });
    }

    render() {
        const {imgList, viewImg} = this.state;
        const count = this.props.count || 1;
        const prefix = this.props.prefix;

        return (
            <div className={`upload ${prefix}`}>
                <input type="file" name='upload-file' id="upload-file" onChange={this.handChange} />
                <img
                    className={cx({
                        'upload-view': true,
                        'upload-view-show': viewImg.isShow,
                    })}
                    src={viewImg.path} style={viewImg.style}
                    onClick={this.closeImg}
                    />
                {imgList.length > 0 && <div className="upload-list">
                    {imgList.map(img => {
                        return (
                            <div key={img.key} className="upload-img">
                                <img src={img.src} />
                                <div className="upload-img-mask">
                                    <a className="upload-img-view" onClick={e => { this.viewImg(img) } }>
                                        <i className="iconfont icon-view" />
                                    </a>
                                    <a className="upload-img-delete" onClick={e => { this.deleteImg(img)} }>
                                        <i className="iconfont icon-delete" />
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                    <img src={this.state.srcPath} />
                </div>}
                {imgList.length<count && <div className="upload-options">
                    <label htmlFor="upload-file" className="upload-add">
                        <a className="upload-add-title"><i className="iconfont icon-plus" /></a>
                    </label>
                </div>}
            </div>
        );
    }
}

ReactUploadImage.defaultProps = {
    prefix: 'upload',
}

ReactUploadImage.propTypes = {
    beforeUpload: PropTypes.func.isRequired,
    fileChange: PropTypes.func.isRequired,
    prefix: PropTypes.string.isRequired,
};

export default ReactUploadImage;
