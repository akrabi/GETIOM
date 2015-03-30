GETIOM - GeoTagged Information on Map
=====================================

GETIOM API is an open source project for representing and analyzing geotagged information on maps.

By @akrabi and @snaxoa

<h2>Data Format</h2>
The information we work with is formatted as <a href="http://geojson.org">GeoJSON</a>.
More precisely, each GeoJSON object should be of type "Feature" and should have a "geometry" member of type "Point" in a geographic coordinate reference system.
All additional information should be under "properties" member.

More information can be found in the Wiki section.

<h4>Example (A twitter message):</h4>
```
{
  "type": "Feature",
  "id": "TwitterMessage",
  "geometry": {
          "type": "Point",
          "coordinates": [102.0, 0.6]
  },
  "properties": {
    "msg": "Hello World!",
    "time": "259797929",
    "client":"twitter_instagram"
  }
}
```

<h2>API</h2>
In order to use GETIOM, an API which allows GET requests to the database containing the GeoTagged information and returning it in the specified GeoJSON format.
The API has a REST like url structure but requires only GET requests to be implemented. Therefore, from now on all paths refer specifically to GET requests to those paths.

<h4>/dbsize</h4>
Parameters: None
Return    : The number of entries in the database

<h4>/filter</h4>
Parameters: None
Return    : Return all entries in the database

<h4>/filter/location/circle</h4>
Parameters:
Return    : Return all entries for which their coordinates are inside the given circle.

<h4>/filter/location/rectangle</h4>
Parameters:
Return    : Return all entries for which their coordinates are inside the given rectangle.

<h4>/filter/location/polygon</h4>
Parameters:
Return    : Return all entries for which their coordinates are inside the given polygon.

