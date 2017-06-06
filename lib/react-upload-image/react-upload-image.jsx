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
            },
        };
        this.handChange = this.handChange.bind(this);
        this.viewImg = this.viewImg.bind(this);
        this.deleteImg = this.deleteImg.bind(this);
        this.getImgInfo = this.getImgInfo.bind(this);
        this.closeImg = this.closeImg.bind(this);
        this.pushImg = this.pushImg.bind(this);
        this.getBase64Image = this.getBase64Image.bind(this);
    }

    componentWillMount() {
        if (this.props.initImgList && this.props.initImgList.length > 0) {
            let dataList = [];
            let promiseArr = [];
            this.props.initImgList.forEach( item => {
                let image = new Image();
                image.src = item;

                promiseArr.push(
                    new Promise((resolve, reject) => {
                        image.onload = ()=> {
                            let imageBase64 = this.getBase64Image(image);
                            dataList.push({
                                width: image.width,
                                height: image.height,
                                src: imageBase64.dataURL,
                                size: imageBase64.size,
                                key: uuidV1(),
                            });
                            resolve();
                        }
                    })
                );
            });

            Promise.all(promiseArr).then( result => {
                this.props.fileChange(dataList);
                this.setState({
                    imgList: dataList,
                });
            });
        } else {
            this.setState({
                imgList: [],
            });
        }

    }

    getBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var dataURL = canvas.toDataURL("image/png");

        let size = parseInt(dataURL.length - (dataURL.length / 8) * 2);

        return {
            dataURL,
            size,
        }
    }

    handChange(e) {
        const { beforeUpload, fileChange } = this.props;

        Promise.all(this.getImgInfo(e)).then(list => {
            if (beforeUpload && !beforeUpload(list)) return;
            
            let promiseArr = [];

            list.forEach(item => {
                promiseArr.push(this.pushImg(item));
            });

            Promise.all(promiseArr).then(()=>{
                fileChange(this.state.imgList);
            });
        });
    }

    pushImg(value) {
        let { imgList } = this.state;

        return new Promise((resolve, reject)=>{
            imgList.push(value);
            this.setState({
                imgList: imgList,
            },function(){
                resolve();
            });
        });
    }

    getImgInfo(e) {
        const fileArray = Array.from(e.target.files);

        let promiseArray = fileArray.map((value, index, arr) => {
            return new Promise((resolve, reject) => {
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
        return promiseArray;
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
        let index = imgList.findIndex((item, index, arr) => {
            return value.key == item.key;
        })
        imgList.splice(index, 1);
        this.setState({
            imgList: imgList,
        });
    }

    render() {
        const { imgList, viewImg } = this.state;
        const { fileKey } = this.props;
        const fileCount = this.props.fileCount || 1;

        return (
            <div className="upload">
                <input type="file" name={`upload-file-${fileKey}`} id={`upload-file-${fileKey}`} onChange={this.handChange} />
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
                                    <Icon type="eye-o" className="upload-img-view" onClick={e => { this.viewImg(img) }} />
                                    <Icon type="delete" className="upload-img-delete" onClick={e => { this.deleteImg(img) }} />
                                </div>
                            </div>
                        );
                    })}
                    <img src={this.state.srcPath} />
                </div>}
                {imgList.length < fileCount && <div className="upload-options">
                    <label htmlFor={`upload-file-${fileKey}`} className="upload-add">
                        <span className="upload-add-title"><Icon type="plus" /></span>
                    </label>
                </div>}
            </div>
        );
    }
}

ReactUploadImage.propTypes = {
    beforeUpload: React.PropTypes.func,
    fileChange: React.PropTypes.func.isRequired,
    fileKey: React.PropTypes.string.isRequired,
    fileCount: React.PropTypes.number,
    initImgList: React.PropTypes.array,
};

export default ReactUploadImage;
