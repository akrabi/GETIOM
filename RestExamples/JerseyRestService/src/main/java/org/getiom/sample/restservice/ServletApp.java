package org.getiom.sample.restservice;


import org.glassfish.jersey.server.ResourceConfig;

import javax.ws.rs.ApplicationPath;

@ApplicationPath("/")
public class ServletApp extends ResourceConfig {
    public ServletApp() {
        packages("org.getiom.restfulservice");
    }
}

