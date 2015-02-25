package org.getiom.sample.restservice;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public class Message {
    private Integer id;
    private Integer userId;
    private Location location;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd,HH:mm")
    private Date date;
    private String text;

    public Message() {
    }

    public Message(Integer id, Integer userId, Location location, Date date, String text) {
        this.id = id;
        this.userId = userId;
        this.location = location;
        this.date = date;
        this.text = text;
    }

    public Integer getId() {
        return id;
    }

    public Integer getUserId() {
        return userId;
    }

    public Location getLocation() {
        return location;
    }

    public Date getDate() {
        return date;
    }

    public String getText() {
        return text;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public void setText(String text) {
        this.text = text;
    }

}

