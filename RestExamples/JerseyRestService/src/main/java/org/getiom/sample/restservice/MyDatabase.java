package org.getiom.sample.restservice;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.logging.Logger;

public class MyDatabase {

    private static final Logger log = Logger.getLogger(MyDatabase.class.getName());

    private static List<Message> messages;
    static {
        ObjectMapper mapper = new ObjectMapper();
        try {
            InputStream in = MyDatabase.class.getResourceAsStream("messages.json");
            messages = mapper.readValue(in, mapper.getTypeFactory().constructCollectionType(List.class, Message.class));
        }
        catch (JsonParseException e) {
            log.warning("Received JsonParseException\n");
        }
        catch (JsonMappingException e) {
            log.warning("Received JsonMappingException\n");
        }
        catch (IOException e) {
            log.warning("Received IOException\n");
        }
    }

    public static List<Message> getMessages() {
        return messages;
    }
}
