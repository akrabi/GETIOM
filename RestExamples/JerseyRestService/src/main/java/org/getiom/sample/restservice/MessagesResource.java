package org.getiom.sample.restservice;

import javafx.scene.shape.Circle;
import javafx.scene.shape.Rectangle;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;
import java.util.stream.Collectors;

@Path("/messages")
public class MessagesResource {
    public static MyDatabase db = new MyDatabase();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Message> getMessages() {
        return db.getMessages();
    }

    @GET
    @Path("/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Message> getMessagesByUserId(@PathParam("userId")Integer userId) {
        List<Message> messages = db.getMessages();
        return messages.stream().filter(m -> m.getUserId() == userId).collect(Collectors.toList());
    }

    @GET
    @Path("/filter/location/circle")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Message> getMessagesInCircle(@QueryParam("lat")Double lat, @QueryParam("lng")Double lng, @QueryParam("radius")Double radius) {
        Circle circle = new Circle(lat, lng, radius);
        List<Message> messages = db.getMessages();
        return messages.stream().filter(m -> circle.contains(m.getLocation().getX(), m.getLocation().getY())).collect(Collectors.toList());
    }

    @GET
    @Path("/filter/location/rectangle")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Message> getMessagesInRectangle(@QueryParam("x")Double x, @QueryParam("y")Double y, @QueryParam("width")Double width, @QueryParam("length")Double length) {
        Rectangle rect = new Rectangle(x,y,width,length);
        List<Message> messages = db.getMessages();
        return messages.stream().filter(m -> rect.contains(m.getLocation().getX(), m.getLocation().getY())).collect(Collectors.toList());
    }

    /*@GET
    @Path("/filter/location/polygon")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Message> getMessagesInPolygon(@QueryParam("x")Double centerX, @QueryParam("y")Double centerY, @QueryParam("r")Double radius) {
        Polygon polygon = new Polygon(points);
        List<Message> messages = db.getMessages();
        return messages.stream().filter(m -> circle.contains(m.getLocation().getX(), m.getLocation().getY())).collect(Collectors.toList());
    }*/
}
