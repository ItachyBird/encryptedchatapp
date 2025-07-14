package com.example.chatapp.service;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(@Value("${cloudinary.url}") String cloudinaryUrl) {
        this.cloudinary = new Cloudinary(cloudinaryUrl);
    }

    /**
     * Uploads a file to Cloudinary and returns the upload result Map.
     * The URL of the uploaded image/video can be found in the map at the key "url".
     *
     * @param file MultipartFile to upload
     * @return Map containing upload result including URL
     */
    public Map<String, Object> uploadFile(MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), null);
            return uploadResult;  // contains URL at key "url"
        } catch (IOException e) {
            throw new RuntimeException("Image upload failed", e);
        }
    }
}
