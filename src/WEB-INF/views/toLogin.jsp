<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html lang="zh">
<script type="text/javascript">
    tologin();
    function tologin(){
        //页面定位
        if (self != top){
            window.top.location = window.location;
        }
        window.location.replace("${loginURI}");
    };
</script>
</html>