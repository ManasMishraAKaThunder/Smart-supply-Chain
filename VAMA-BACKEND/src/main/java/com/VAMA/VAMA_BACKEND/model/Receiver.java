package com.VAMA.VAMA_BACKEND.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "receivers")
public class Receiver {

    @Id
    private String id;

    private String userId;           // references users collection

    @Indexed(unique = true)
    private String email;

    private String name;
    private String phone;
    private String address;
    private String contact;          // contact info displayed to other users

    private List<String> category = new ArrayList<>();

    private double rating = 0.0;
    private int bulkOrders = 0;
    private boolean bulkBuyer = false;
    private boolean frequent = false;
    private boolean active = true;
}