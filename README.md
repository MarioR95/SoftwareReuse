# Software Reuse

This project is meant as a platform for adding software components on it and then searching and executing components in web interface.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.


### Prerequisites

What things you need to install the software and how to install them

* Download and install 'Neo4j' graph database software from here: https://bit.ly/2OQxgbf

* Download and install 'Node.js' javascript server from here: https://bit.ly/1Wdc3FQ

* Download and install 'Java JDK version 1.10' from here: https://bit.ly/2N5ECpD

* We suggest download of 'Visual Studio Code' IDE from here: https://bit.ly/1J6QrU6


### Installing

A step by step series that tell you how to get a development env running


#### Node.js server running: ####

1. Go to your project cloned directory 'SoftwareReuse\src'.

2. Execute the following command: node server.js


#### Fuseki dataset creation: ####

1. Open web browser and go to 'localhost:3030', Fuseki admin interface will open.

2. Click on 'Add one' to add a new dataset.

3. Give 'OntRepository' as dataset's name and 'Persistent' as dataset type, then click on 'create dataset'.


#### Neo4j database creation: ####

1. Open 'Neo4j' desktop and create a new project.

2. Create a new local graph, give it 'ComponentDB' as name and '123456' as password.

3. Click on start to launch the graph.

4. Click on 'Neo4j Browser' to open the web interface, you are ready to control the database.


#### Web addresses to launch the software and to control system ####

Solr admin interaface reachable through localhost:8983 address.

Fuseki admin interface reachable through localhost:3030 address.

SoftwareReuse start page reachable through localhost:8080 address.


## Deployment

1. Clone github repository
2. Follow the installation instructions
3. Go to localhost:8080
4. Enjoy :)


## Authors

* **Francesco Califano** - *Software Reuse* - [FranCali](https://github.com/FranCali)
* **Domenico Marino** - *Software Reuse* - [DomenicoM92](https://github.com/DomenicoM92)
* **Mario Ruggiero** - *Software Reuse* - [MarioR95](https://github.com/MarioR95)


See also the list of [contributors](https://github.com/MarioR95/SoftwareReuse/graphs/contributors) who participated in this project.

## License

This project is totally open source and free to use.


