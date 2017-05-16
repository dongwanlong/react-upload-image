# react-upload-image
基于react的base64图片上传组件

###############   demo运行   ###############

npm install
npm start



###############   接口描述   ###############

beforeUpload：回调参数中传递当前图片文件信息列表，包括尺寸，大小，base64原数据，返回true验证通过，返回fasle验证失败

fileChange：回调参数中传递当前图片文件信息列表，包括尺寸，大小，base64原数据

prefix：外层DOM自定义类添加，用于覆盖组件样式
