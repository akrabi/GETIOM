<img src="https://github.com/akrabi/GETIOM/blob/master/GETIOM-logo.png">

# Welcome to GETIOM!

<a href="https://github.com/akrabi/GETIOM/">GETIOM</a> is an open source project for representing and analyzing Geo-Tagged information on Google Maps.
The project is based on <a href="https://nodejs.org/">Node.js</a> platform and other Open-Source algorithms.

The main goal of our project is to provide an easy framework in order to process & analyze Geo-Tagged information (Big Data) on the Google Map's platform - without the need to mess with servers and configurations. All you need to do is to provide a <a href="http://en.wikipedia.org/wiki/Representational_state_transfer">REST API</a> with a <a href="http://geojson.org/">GeoJSON</a> collection (<a href="https://github.com/akrabi/GETIOM/wiki/Rest-API">Explained here</a>) and start using the app's flow even today!

## Full Documentation

See the [Wiki](https://github.com/akrabi/GETIOM/wiki) for full documentation, examples, operational details and other information.

## Communication
- <a href="https://github.com/snaxoa">snaxoa</a> 
- <a href="https://github.com/akrabi">akrabi</a>

## What does it do?

#### 1) An easy-to-use Geo-Tagged analyzing framework!

Stop wasting your time on configuring servers and settings. GETIOM handle's all the hard work for you! Simply run the server via Node.js and start analyzing your data. Frustration free!

#### 2) Realtime Operations

Realtime monitoring and configuration changes. Watch service and property changes take effect immediately as they spread across a fleet. 

Be alerted, make decisions, affect change and see results in seconds. 

#### 3) Concurrency

Parallel execution. Concurrency aware request caching. Automated batching through request collapsing.

## Hello World!

Code to be isolated is wrapped inside the run() method of a HystrixCommand similar to the following:

```java
public class CommandHelloWorld extends HystrixCommand<String> {

    private final String name;

    public CommandHelloWorld(String name) {
        super(HystrixCommandGroupKey.Factory.asKey("ExampleGroup"));
        this.name = name;
    }

    @Override
    protected String run() {
        return "Hello " + name + "!";
    }
}
```

This command could be used like this:

```java
String s = new CommandHelloWorld("Bob").execute();
Future<String> s = new CommandHelloWorld("Bob").queue();
Observable<String> s = new CommandHelloWorld("Bob").observe();
```

More examples and information can be found in the [How To Use](https://github.com/Netflix/Hystrix/wiki/How-To-Use) section.

Example source code can be found in the [hystrix-examples](https://github.com/Netflix/Hystrix/tree/master/hystrix-examples/src/main/java/com/netflix/hystrix/examples) module.

## Binaries

Binaries and dependency information for Maven, Ivy, Gradle and others can be found at [http://search.maven.org](http://search.maven.org/#search%7Cga%7C1%7Cg%3A%22com.netflix.hystrix%22%20AND%20a%3A%22hystrix-core%22).

Change history and version numbers => [CHANGELOG.md](https://github.com/Netflix/Hystrix/blob/master/CHANGELOG.md)

Example for Maven:

```xml
<dependency>
    <groupId>com.netflix.hystrix</groupId>
    <artifactId>hystrix-core</artifactId>
    <version>x.y.z</version>
</dependency>
```
and for Ivy:

```xml
<dependency org="com.netflix.hystrix" name="hystrix-core" rev="x.y.z" />
```

If you need to download the jars instead of using a build system, create a Maven pom file like this with the desired version:

```xml
<?xml version="1.0"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<groupId>com.netflix.hystrix.download</groupId>
	<artifactId>hystrix-download</artifactId>
	<version>1.0-SNAPSHOT</version>
	<name>Simple POM to download hystrix-core and dependencies</name>
	<url>http://github.com/Netflix/Hystrix</url>
	<dependencies>
		<dependency>
			<groupId>com.netflix.hystrix</groupId>
			<artifactId>hystrix-core</artifactId>
			<version>x.y.z</version>
			<scope/>
		</dependency>
	</dependencies>
</project>
```

Then execute:

```
mvn -f download-hystrix-pom.xml dependency:copy-dependencies
```

It will download hystrix-core-*.jar and its dependencies into ./target/dependency/.

You need Java 6 or later.

## Build

To build:

```
$ git clone git@github.com:Netflix/Hystrix.git
$ cd Hystrix/
$ ./gradlew build
```

Futher details on building can be found on the [Getting Started](https://github.com/Netflix/Hystrix/wiki/Getting-Started) page of the wiki.

## Run Demo

To run a [demo app](https://github.com/Netflix/Hystrix/tree/master/hystrix-examples/src/main/java/com/netflix/hystrix/examples/demo/HystrixCommandDemo.java) do the following:

```
$ git clone git@github.com:Netflix/Hystrix.git
$ cd Hystrix/
./gradlew runDemo
```

You will see output similar to the following:

```
Request => GetUserAccountCommand[SUCCESS][8ms], GetPaymentInformationCommand[SUCCESS][20ms], GetUserAccountCommand[SUCCESS, RESPONSE_FROM_CACHE][0ms]x2, GetOrderCommand[SUCCESS][101ms], CreditCardCommand[SUCCESS][1075ms]
Request => GetUserAccountCommand[FAILURE, FALLBACK_SUCCESS][2ms], GetPaymentInformationCommand[SUCCESS][22ms], GetUserAccountCommand[FAILURE, FALLBACK_SUCCESS, RESPONSE_FROM_CACHE][0ms]x2, GetOrderCommand[SUCCESS][130ms], CreditCardCommand[SUCCESS][1050ms]
Request => GetUserAccountCommand[FAILURE, FALLBACK_SUCCESS][4ms], GetPaymentInformationCommand[SUCCESS][19ms], GetUserAccountCommand[FAILURE, FALLBACK_SUCCESS, RESPONSE_FROM_CACHE][0ms]x2, GetOrderCommand[SUCCESS][145ms], CreditCardCommand[SUCCESS][1301ms]
Request => GetUserAccountCommand[SUCCESS][4ms], GetPaymentInformationCommand[SUCCESS][11ms], GetUserAccountCommand[SUCCESS, RESPONSE_FROM_CACHE][0ms]x2, GetOrderCommand[SUCCESS][93ms], CreditCardCommand[SUCCESS][1409ms]

#####################################################################################
# CreditCardCommand: Requests: 17 Errors: 0 (0%)   Mean: 1171 75th: 1391 90th: 1470 99th: 1486 
# GetOrderCommand: Requests: 21 Errors: 0 (0%)   Mean: 100 75th: 144 90th: 207 99th: 230 
# GetUserAccountCommand: Requests: 21 Errors: 4 (19%)   Mean: 8 75th: 11 90th: 46 99th: 51 
# GetPaymentInformationCommand: Requests: 21 Errors: 0 (0%)   Mean: 18 75th: 21 90th: 24 99th: 25 
#####################################################################################

Request => GetUserAccountCommand[SUCCESS][10ms], GetPaymentInformationCommand[SUCCESS][16ms], GetUserAccountCommand[SUCCESS, RESPONSE_FROM_CACHE][0ms]x2, GetOrderCommand[SUCCESS][51ms], CreditCardCommand[SUCCESS][922ms]
Request => GetUserAccountCommand[SUCCESS][12ms], GetPaymentInformationCommand[SUCCESS][12ms], GetUserAccountCommand[SUCCESS, RESPONSE_FROM_CACHE][0ms]x2, GetOrderCommand[SUCCESS][68ms], CreditCardCommand[SUCCESS][1257ms]
Request => GetUserAccountCommand[SUCCESS][10ms], GetPaymentInformationCommand[SUCCESS][11ms], GetUserAccountCommand[SUCCESS, RESPONSE_FROM_CACHE][0ms]x2, GetOrderCommand[SUCCESS][78ms], CreditCardCommand[SUCCESS][1295ms]
Request => GetUserAccountCommand[FAILURE, FALLBACK_SUCCESS][6ms], GetPaymentInformationCommand[SUCCESS][11ms], GetUserAccountCommand[FAILURE, FALLBACK_SUCCESS, RESPONSE_FROM_CACHE][0ms]x2, GetOrderCommand[SUCCESS][153ms], CreditCardCommand[SUCCESS][1321ms]
```

This demo simulates 4 different [HystrixCommand](https://github.com/Netflix/Hystrix/tree/master/hystrix-core/src/main/java/com/netflix/hystrix/HystrixCommand.java) implementations with failures, latency, timeouts and duplicate calls in a multi-threaded environment.

It logs the results of [HystrixRequestLog](https://github.com/Netflix/Hystrix/tree/master/hystrix-core/src/main/java/com/netflix/hystrix/HystrixRequestLog.java) and metrics from [HystrixCommandMetrics](https://github.com/Netflix/Hystrix/tree/master/hystrix-core/src/main/java/com/netflix/hystrix/HystrixCommandMetrics.java).

## Dashboard

A dashboard for monitoring applications using Hystrix is available in the [hystrix-dashboard](https://github.com/Netflix/Hystrix/tree/master/hystrix-dashboard) module.

More information can be found on the [Dashboard Wiki](https://github.com/Netflix/Hystrix/wiki/Dashboard).

<img src="https://raw.github.com/wiki/Netflix/Hystrix/images/hystrix-dashboard-single-row.png">

## Bugs and Feedback

For bugs, questions and discussions please use the [Github Issues](https://github.com/akrabi/GETIOM/issues).



