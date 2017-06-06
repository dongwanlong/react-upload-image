react-upload-image
===========================
这是一个基于base64传输的图片上传插件。准确来说，这个插件只负责图片处理，你可以在文件回调函数中获取选中的base64图片数据列表，然后自己在任何时候调用post请求传递出去。这种方式避免了错误的图片上传后图片存留问题。值得一提的是，这个插件支持外部图片url地址初始化已选择的图片列表！
****

#### beforeUpload
对上传的图片进行校验
```
函数返回true校验成功，false校验失败
beforeUpload(list){
  list.forEach(item => {
    item.width; //图片宽度
    item.height;  //图片高度
    item.size;  //图片大小
  });
}
```

#### fileChange
对上传的图片进行校验
```
上传文件回调函数
fileChange(list){
  list.forEach(item => {
    item.width; //图片宽度
    item.height;  //图片高度
    item.size;  //图片大小
    item.src; //base64图片数据
  });
}
```

#### fileKey
一个页面中使用多个插件时需要指定唯一input ID


#### fileCount
图片列表数量上限，默认1个


#### initImgList
用于初始化图片列表，传递图片url数组列表，组件会把url列表转化为base64数据列表
