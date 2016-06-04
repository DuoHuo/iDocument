# idoc开放api

## 目录:

1. [搜索文档](#doc-1)
2. [获取所有学院列表](#doc-2)
3. [获取学院所有的学科和文档](#doc-3)
4. [搜索学科](#doc-4)
5. [获取某个学科下所有的文档](#doc-5)
6. [下载文档](#doc-6)
7. [获取轮播图资源](#doc-7)
8. [获取友情链接资源](#doc-8)


<h2>1.文档</h2>

<h3 id="doc-1">搜索文档</h3>

#### 请求

`GET /api/v1/search/docs`

###### 参数描述
| 名字 | 类型 | 详细描述 |
| ----- | ----- | -------- |
| q | string | 输入文档名查询 |
| sort | string | 排序条件，可以是'downloads', 'updateTime'(默认) |

#### 示例

##### 获取最新文档（按时间排序）
/api/v1/search/docs 默认按时间先后排序

##### 获取最热的文档（按下载量排序）
/api/v1/search/docs?sort=downloads 按下载量降序排序

##### 按文档名称搜索文档
/api/v1/search/docs?q=高数 查找和高数相关的文档

<h3 id="doc-2">获取所有学院</h3>

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

<h3 id="doc-3">获取学院所有的学科和文档</h3>

#### 请求

`GET /colleges/:id/courses/docs`

#### 响应

```json
{
  "college": {
    "_id": "530fdf6c20be5f5d51a7f650",
    "collegeName": "水文气象学院",
    "collegepic": "/img/professional/swqx.png",
    "updateTime": 1393549164
  },
  "courses": [
    {
      "_id": "533eb04cb9a01bcf2948af72",
      "courseName": "水文分析",
      "courseType": "professional",
      "courseBelongs": "530fdf6c20be5f5d51a7f650",
      "coursepic": "http://i1.buimg.com/58872ac9ecbc9c27.jpg"
    }
  ],
  "docs": []
}
```

<h3 id="doc-4">搜索学科</h3>

#### 请求

`GET /search/courses?type=general`

###### 参数描述
| 名字 | 类型 | 详细描述 |
| ----- | ----- | -------- |
| type | string | 搜索通修课列表或者专业课（general/professional） |

#### 响应

##### 参数描述
| 名字 | 类型 | 详细描述 |
| ----- | ----- | -------- |
| total | number | 学科数目 |
| courses | list | 学科列表 |

##### 示例
/api/v1/search/courses 返回所有学科
/api/v1/search/courses?type=general 返回所有公共课
/api/v1/search/courses?type=professional 返回所有专业课

<h3 id="doc-5">获取某个学科下所有的文档</h3>

#### 请求

`GET /api/v1/courses/:id/docs`

###### 参数描述
| 名字 | 类型 | 详细描述 |
| ----- | ----- | -------- |
| id | number | 学科id |


#### 响应
```json
{
	"course": {
    "_id": "53113c9b1eb6e2b9546b5a90",
    "courseBelongs": "530fe1a120be5f5d51a7f658",
    "courseDownloads": 7155,
    "courseName": "高等数学",
    "courseType": "general",
    "coursepic": "/img/course.jpg"
  },
  "docs": [
    {
      "_id": "53113d6e1eb6e2b9546b5a91",
      "title": "高等数学1（理）09-10期末考试A卷及答案",
      "link": "http://pan.baidu.com/s/1pJyMqG7"
    },
    ....
  ]
}
```

<h3 id="doc-6">下载文档</h3>

#### 请求

`GET /api/v1/download/:id`

###### 参数描述
| 名字 | 类型 | 详细描述 |
| ----- | ----- | -------- |
| id | number | 文档id |

#### 响应
返回文件下载链接

http://pan.baidu.com/s/1pJyMqG7

<h3 id="doc-7">获取轮播图资源</h3>

#### 请求

`GET /api/v1/banners`

#### 响应

返回所有轮播图资源
```json
{
  "total": 3,
  "banners": [
    {
      "_id": "57505cc5079a345540d4aac9",
      "bannerName": "校学习部介绍",
      "bannerIndex": 3,
      "bannerPic": "img/xx.png",
      "bannerLink": "",
      "__v": 0
    },
    ...
  ]
}
```
<h3 id="doc-8">获取友情链接资源</h3>

#### 请求

`GET /api/v1/links`

#### 响应

返回所有友情链接资源
```json
{
  {
    "total": 8,
    "links": [
      {
        "_id": "57505cdc079a345540d4aacc",
        "title": "关于iDocument",
        "link": "/about-us.html",
        "category": "duohuo",
        "__v": 0
      }
    ]
  }
}
```
