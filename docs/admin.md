# 管理后台

## 目录:

1. [登录](#doc-1)
2. [登出](#doc-2)
3. [获取文档资源](#doc-3)
4. [增加文档](#doc-4)
5. [修改文档](#doc-5)
6. [删除文档](#doc-6)
7. [获取学科资源](#doc-7)
8. [增加学科](#doc-8)
9. [删除学科](#doc-9)
10. [获取学院资源](#doc-10)
11. [增加学院](#doc-11)
12. [删除学院](#doc-12)
13. [获取轮播图资源](#doc-13)
14. [增加轮播图](#doc-14)
15. [删除轮播图](#doc-15)
16. [获取链接资源](#doc-16)
17. [增加链接](#doc-17)
18. [删除链接](#doc-18)


<h2>1.登录和登出</h2>

<h3 id="doc-1">管理员登入</h3>

#### 请求

`POST /api/v1/login`

###### 参数描述
| 名字 | 类型 | 详细描述 |
| ----- | ----- | -------- |
| email | string | 管理员邮箱 |
| password | string | 密码 |

#### 响应

code 204

<h3 id="doc-2">管理员登出</h3>

#### 请求

`GET /api/v1/logout`


#### 响应

code 204


<h2>2.文档资源</h2>

<h3 id="doc-3">获取文档资源</h3>

#### 请求

`GET /api/v1/docs`

#### 响应

```json
[
	{
	    "_id": "53113d6e1eb6e2b9546b5a91",
	    "title": "高等数学1（理）09-10期末考试A卷及答案",
	    "fileType": "pdf",
	    "belongs": {
	      "_id": "530fe1a120be5f5d51a7f658",
	      "collegeName": "数学与统计学院",
	      "collegepic": "/img/professional/sxytj.png",
	      "updateTime": 1393549730
	    },
	    "course": "53113c9b1eb6e2b9546b5a90",
	    "type": "general",
	    "link": "http://pan.baidu.com/s/1pJyMqG7",
	    "downloads": 209,
	    "searchIndex": [
	      "高",
	      "等",
	      "数",
	      "学",
	      "1",
	      "（",
	      "理",
	      "）",
	      "0",
	      "9",
	      "-",
	      "1",
	      "0",
	      "期",
	      "末",
	      "考",
	      "试",
	      "a",
	      "卷",
	      "及",
	      "答",
	      "案"
	    ],
	    "updateTime": "1970-01-17T03:07:18.767Z"
	  }
]
```

<h3 id="doc-4">增加文档</h3>

#### 请求

`POST /api/v1/admin/docs`

###### 参数描述
| 名字 | 类型 | 详细描述 |
| ----- | ----- | -------- |
| title | string | 新增文件的文件名 |
| link | string | 文件的下载地址 |
| fileType | string | 文件的类型 |
| courseId | string | 文件所属学科的Id |
| collegeId | string | 文件所属学院的Id |
| type | string | 文件是属于通修课还是专业课（general/professional） |

###### 参数示例

```js
title:测试sdfsdfds
link:www.baidu.com
fileType:doc
courseId:53113c9b1eb6e2b9546b5a90
type:general
belongs:530fe1a120be5f5d51a7f658
```

#### 响应

code 204

<h3 id="doc-5">修改文档记录</h3>

#### 请求

`PUT /api/v1/admin/docs/:id`

###### 参数描述
| 名字 | 类型 | 详细描述 |
| ----- | ----- | -------- |
| title | string | 新增文件的文件名 |
| link | string | 文件的下载地址 |
| fileType | string | 文件的类型 |
| courseId | string | 文件所属学科的Id |
| belongs | string | 文件所属学院的Id |
| type | string | 文件是属于通修课还是专业课（general/professional） |

###### 参数示例

```js
title:测试sdfsdfds
link:www.baidu.com
fileType:doc
courseId:53113c9b1eb6e2b9546b5a90
type:general
belongs:530fe1a120be5f5d51a7f658
```

#### 响应

code 204

<h3 id="doc-6">删除一条文档记录</h3>

#### 请求

`DELETE /api/v1/admin/docs/:id`

#### 响应

code 204

<h2>3.学科资源</h2>

<h3 id="doc-7">获取所有学科</h3>

#### 请求

`GET /api/v1/courses`

#### 响应

```json
[
	{
    "_id": "53113c9b1eb6e2b9546b5a90",
    "courseBelongs": "530fe1a120be5f5d51a7f658",
    "courseDownloads": 7155,
    "courseName": "高等数学",
    "courseType": "general",
    "coursepic": "/img/course.jpg"
  },
]
```

<h3 id="doc-8">增加一条学科记录</h3>

#### 请求

`POST /api/v1/admin/courses`

###### 参数描述
| 名字 | 类型 | 详细描述 |
| ----- | ----- | -------- |
| courseName | string | 学科名称 |
| coursepic | string | 学科缩略图链接 |
| courseBelongs | string | 学科所属学院的Id |
| courseType | string | 通修课还是专业课（general/professional） |

###### 参数示例

```js
courseName:测试学科
courseType:general
coursepic:www.baidu.com
courseBelongs:530fe1a120be5f5d51a7f658
```

#### 响应

code 204

<h3 id="doc-9">删除一条学科记录</h3>

#### 请求

`DELETE /api/v1/admin/courses/:id`

#### 响应

code 204

<h2>4.学院资源</h2>

<h3 id="doc-10">获取所有学院</h3>

#### 请求

`GET /api/v1/colleges`

#### 响应

```json
[
	{
    "_id": "530fdc631e13cbe450225d9b",
    "collegeName": "大气科学学院",
    "collegepic": "/img/professional/dqkx.png",
    "updateTime": 1393548388
  },
]
```

<h3 id="doc-11">增加一条学院记录</h3>

#### 请求

`POST /api/v1/admin/colleges`

###### 参数描述
| 名字 | 类型 | 详细描述 |
| ----- | ----- | -------- |
| collegeName | string | 学院名称 |
| collegepic | string | 学院缩略图链接 |

###### 参数示例

```js
collegeName:测试学院
collegepic:www.baidu.com
```

#### 响应

code 204

<h3 id="doc-12">删除一条学院记录</h3>

#### 请求

`DELETE /api/v1/admin/colleges/:id`

#### 响应

code 204

<h2>5.轮播图资源</h2>

<h3 id="doc-10">获取所有轮播图</h3>

#### 请求

`GET /api/v1/banners`

#### 响应

```json
[
	{
    "_id": "574fb1485647aaf122d811e5",
    "bannerName": "校学习部介绍",
    "bannerIndex": 3,
    "bannerPic": "img/xx.png",
    "bannerLink": "",
    "__v": 0
  }
]
```

<h3 id="doc-11">增加一条轮播图记录</h3>

#### 请求

`POST /api/v1/admin/banners`

###### 参数描述
| 名字 | 类型 | 详细描述 |
| ----- | ----- | -------- |
| bannerName | string | banner名称 |
| bannerPic | string | banner图链接 |
| bannerLink | string | banner链接 |
| bannerIndex | string | banner索引 |

###### 参数示例

```js
bannerName:测试banner
bannerPic:/img/dh.png
bannerLink:www.baidu.com
bannerIndex:12
```

#### 响应

code 204

<h3 id="doc-12">删除一条轮播图记录</h3>

#### 请求

`DELETE /api/v1/admin/banners/:id`

#### 响应

code 204

<h2>6.链接资源</h2>

<h3 id="doc-10">获取链接资源</h3>

#### 请求

`GET /api/v1/links`

#### 响应

```json
[
	{
    "_id": "574fcbd0bf205ab02c88ce54",
    "title": "关于iDocument",
    "link": "/about-us.html",
    "category": "duohuo",
    "__v": 0
  }
]
```

<h3 id="doc-11">增加一条链接记录</h3>

#### 请求

`POST /api/v1/admin/links`

###### 参数描述
| 名字 | 类型 | 详细描述 |
| ----- | ----- | -------- |
| title | string | 名称 |
| category | string | duohuo/friendship/about |
| link | string | 链接地址 |

###### 参数示例

```js
title:计算机与软件学院
category:friendship
link:http://www.baidu.com
```

#### 响应

code 204

<h3 id="doc-12">删除一条链接记录</h3>

#### 请求

`DELETE /api/v1/admin/links/:id`

#### 响应

code 204
