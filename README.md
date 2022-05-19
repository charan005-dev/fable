# Fable - a social story-telling platform
Fable is a web-enabled, web-ready, multi-browser compatible, ReactJS-powered web application where users can post stories, read new stories written by other authors, add stories to library and share them across the community. Writing a story and publishing it through a publishing house is heavily bureaucratic and it adds a lot of stress to the author. We want to do away with those bureaucracies and give authors a free place to express themselves in the form of stories.
 
#Tutorial: 
- https://youtu.be/nHj-IwbZ5XI 


## Features
- Story lovers can find a sea of books written by various authors
- Authors can have a quick story posting tool that will help them reaach global audience
- Users can create multiple libraries and can have the liberty to add their favorites in multiple libraries
- Libraries can be made public for the global audience and private for themselves!
- Our built-in elastic search engine will search through the title and content, and provide most relevant results
- Genre tags will be available for every story and users can also have an option to do genre-based filtering
- Homepage gives a genre and topic based filtering which gives you a wide choice to read
- Users can add comments, likes, and can add to their favorites for the books they read

> I do believe something good will happen after reading a very good book!

## Team Members

- Aravindh Shiva Gunasekharan
- Charan Sundar Telaganeni
- Jeshwanth Kumar
- Koushal Anitha Raja
- Koushik Anitha Raja

## Tech
Technologies we used to build this masterpiece!
> Core Technologies
- **React.js** - front-end framework on which Fable runs
- **MongoDb** - our NoSQL database
- **Node.js + Express.js** - backend server for application serving
- **Redis** - used for caching user data
- **Firebase** - used for dynamic authentication
- **Material-UI** - for beautiful front-end components and templates
>Independent Technologies
- **Docker** - containerization tool on which we'll run our elasticsearch backend
- **ElasticSearch** - fast, text-based search engine to retrieve stories based on content and title
- **GraphicsMagick** - image manipulation library for cropping and resizing our cover images

## Setting everything up

What you'll need:
- [Redis](https://redis.io/docs/getting-started/)
- [GraphicsMagick](http://www.graphicsmagick.org/README.html)
- [Docker](https://www.docker.com/products/docker-desktop/)
- [ElasticSearch](https://www.elastic.co/guide/en/enterprise-search/current/docker.html)

### ElasticSearch installation

- [Complete Reference](https://www.elastic.co/guide/en/enterprise-search/current/docker.html)
> Some docker hub links mentioned in the above document are not available. Use these installation commands instead:

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

### Steps

#### Docker Installation

1. Download [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Change the resource settings after starting Docker Desktop and allocate more than 4 GB of memory.
3. For Windows devices, these settings could be controlled by [WSL2](https://docs.microsoft.com/en-us/windows/wsl/install). You'll need to write the settings to a `.wslconfig` file. Follow the steps mentioned [here](https://stackoverflow.com/a/62773629/9427235).
4. In some cases, it is also good to allocate a good portion of swap memory as we've seen cases where a low swap memory has caused our containers to crash.

#### ElasticSearch Installation

1. Once you setup Docker and get it up and running, pull the Elasticsearch container from docker hub through `docker pull elasticsearch:8.2.0`
2. Create a docker network using `docker network create elastic`
3. Follow the instructions (commands) mentioned above (`docker run`) for starting up the elasticsearch container.
4. Once the container is started, look out for the logs that print details about the password, enrollment token, and Elasticsearch address. Copy these details onto a text file - we'll need these later on.
5. grep the elasticsearch logs and look for the text `publish_address` - store the publish_address in your text file.
6. Open a new terminal window and run Kibana (follow the commands mentioned above).
7. Kibana will prompt you to access an endpoint in the form of `0.0.0.0:5601/code=*`. Access this in a browser and login using the details that we pasted in the 4th step. The username is `elastic`.
8. Once this is done, we'd have to boot up the Enterprise App Search container. Follow the instructions mentioned above but change the following details in the commands - 
    - `secret_management.encryption_keys` (this could be generated through the steps mentioned [here](https://www.elastic.co/guide/en/enterprise-search/current/encryption-keys.html))
    - `elasticsearch.host` (the publish address grepped before)
    - `elasticsearch.password` (the password added to our text file in step 4)
9. Once you start everything up, make sure that all the three containers are running, navigate to Kibana `0.0.0.0:5601`, login and open Elastic App Search.
10. Create a new search engine and copy the credentials (private & search) from the engine description page.
11. Add the search engine name and your private key to the server's `.env` file (as `ELASTICSEARCH_ENGINE_NAME` and `ELASTICSEARCH_API_KEY` respectively).
12. If the containers are working as expected, you should see your stories being added as documents to your search engine and searching for a story should return the story details.

##### Exceptional Cases
1. Very rarely, you might see errors with Kibana that mention about an inability to verify the ElasticSearch license. Most times, it will crash if < 4 GB of memory is allocated. The best way forward here is to drop the volume that was created along with the elasticsearch container start (using `docker volume rm es-config`) so that you can start elasticsearch again with a fresh configuration. Every time you reset this, you'll have to create a new search engine and add new credentials to your `.env` file. Your previously indexed documents will also be lost.

> We wanted to use the cloud-based version of Enterprise App Search instead, however, the cloud-based version comes with a ? free-trial only for 14 days. So we opted for a more generic, local installation instead.

2. In some Windows devices, the container might crash due to insufficient `vm.max_map_count`. You can set this in your WSL by following the steps mentioned [here](https://www.elastic.co/guide/en/elasticsearch/reference/8.2/docker.html#_windows_with_docker_desktop_wsl_2_backend).

#### GraphicsMagick Installation

1. On MacOS devices, you can easily install graphicsmagick binaries through Homebrew. Install [Homebrew](https://brew.sh/) if you don't already have it, and run `brew install graphicsmagick`.
2. On Windows devices, you can follow steps mentioned [here](http://www.graphicsmagick.org/INSTALL-windows.html) to download an installer which will install the binaries.

## Usage of .env files

You'll need .env files for running both the server and the front-end. 

In the server .env file, enter the following details:
```
ELASTICSEARCH_API_KEY=<private-key-from-elasticsearch>
ELASTICSEARCH_ENGINE_NAME=<search-engine-name>
<!-- rest of the .env file (firebase for firebase-admin) -->
GM_FS_COVER_PATH=<local-absolute-filesystem-path-to-the-public/covers-page-in-the-server>
``` 

The client .env file contains details about the firebase account. The `GM_FS_COVER_PATH` is very important and it needs to be an absolute path from your root `/` directory in Unix systems or a path from your `C://` drive in Windows systems. Not setting a correct path will print out an error to the console during story creation and story editing (adding cover images).

### Further Details

1. We upload the images added in the application to our local filesystem. As such, you will need a `public` directory in the root of your server directory (`fable/server`) inside which there should be two more directories `covers` and `userImages`. There should be valid paths available for `/public/covers` and `/public/userImages` or else image uploads would not work.
2. We have taken care to handle exceptions with the independent technologies mentioned above - if, due to any configuration reasons or issues with the testing device, any of the independent technologies mentioned above cannot be configured for testing, the application will not break.

