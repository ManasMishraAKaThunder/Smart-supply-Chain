package com.VAMA.VAMA_BACKEND.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "warehouses")
public class Warehouse {

    @Id
    private String id;

    private String userId;           // references users collection

    @Indexed(unique = true)
    private String email;

    private String name;
    private String contact;
    private String phone;
    private String location;         // city / region label
    private String address;          // full address

    private List<String> category = new ArrayList<>();

    private double rating = 0.0;
    private boolean active = true;
}
