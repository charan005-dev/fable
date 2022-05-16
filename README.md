# Fable - a social story-telling platform
Fable is a web-enabled, web-ready, multi-browser compatible, ReactJS-powered web application where users can post stories, read new stories written by other authors, add stories to library and share them across the community. Writing a story and publishing it through a publishing house is all heavily beauraucratic and it adds a lot of stress to the author. We want to do away with those things and give authors a free place to express themselves in the form of stories.

## Features
- Story Lovers can find a sea of books written by various authors
- Authors can have a quick story posting tool that will help them reaach global audience
- Users can create multiple libraries and can have the liberty to add their favorites in multiple libraries
- Libraries can be made public for the global audience and private for themselves!
- Our built-in elastic search engine will search through the title and content, and provide most relevant results
- Genre tags will be available for every story and users can also have an option to do genre-based filtering
- Homepage gives a genre and topic based filtering which gives you a wide choice to read
- Users can add comments, likes, and can add to their favorites for the books they read
> I do beleive something good will happen after reading a very good book!

## Tech
Technologies we used to build this masterpiece!
>Core Technologies
- [ REACT JS ] - front-end framework on which fable runs
- [MONGODB] - our NoSQL database
- [NODE JS & EXPRESS JS] - backend server for application serving
- [REDIS] - used for caching user data
- [FIREBASE] - used for dynamic authentication
- [MATERIAL-UI] - for beautiful front-end components and templates
>Independent Technologies
- [DOCKER] - containerization tool on which we'll run our elasticsearch backend
- [ELASTIC SEARCH] - fast, text-based search engine based on the Lucene library to retrieve story content
- [GRAPHICSMAGICK] - image manipulation library for cropping and resizing our cover images

## Setting everything up

What you'll need:
- [Redis](https://redis.io/docs/getting-started/)
- [GraphicsMagick](http://www.graphicsmagick.org/README.html)
- [Docker](https://www.docker.com/products/docker-desktop/)
- [ElasticSearch](https://www.elastic.co/guide/en/enterprise-search/current/docker.html)

### ElasticSearch installation

- [Complete Reference](https://www.elastic.co/guide/en/enterprise-search/current/docker.html)
- The docker hub links mentioned in the above document are not available. Use these installation commands instead:
_ElasticSearch_
```
docker run \
--name "elasticsearch" \
--network "elastic" \
--publish "9200:9200" \
--volume "es-config:/usr/share/elasticsearch/config:rw" \
--interactive \
--tty \
--rm \
"elasticsearch:8.2.0"
```
_Kibana_
```
docker run \
--name "kibana" \
--network "elastic" \
--publish "5601:5601" \
--interactive \
--tty \
--rm \
--env "ENTERPRISESEARCH_HOST=http://enterprise-search:3002" \
"kibana:8.2.0"
```
_Enterprise App Search_
```
docker run \
--name "enterprise-search" \
--network "elastic" \
--publish "3002:3002" \
--volume "es-config:/usr/share/enterprise-search/es-config:ro" \
--interactive \
--tty \
--rm \
--env "secret_management.encryption_keys=['872d87c704a3a7ee379c3b5cbb615d16e3e1df957bd9dcd0f033851868536c76']" \
--env "allow_es_settings_modification=true" \
--env "elasticsearch.host=https://172.19.0.2:9200" \
--env "elasticsearch.username=elastic" \
--env "elasticsearch.password='password'" \
--env "elasticsearch.ssl.enabled=true" \
--env "elasticsearch.ssl.certificate_authority=/usr/share/enterprise-search/es-config/certs/http_ca.crt" \
--env "kibana.external_url=http://kibana:5601" \
"docker.elastic.co/enterprise-search/enterprise-search:8.2.0"
```

- Also make sure that you allocate more than 4 GB of Docker memory or ElasticSearch can crash in the middle.


