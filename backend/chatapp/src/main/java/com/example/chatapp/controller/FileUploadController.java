package com.example.chatapp.controller;

import com.example.chatapp.model.ChatMessage;
import com.example.chatapp.repository.ChatMessageRepository;
import com.example.chatapp.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping({"/api/files", "/api/media"})
@CrossOrigin(origins = "http://localhost:3000")
public class FileUploadController {

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private ChatMessageRepository chatRepo;

    @PostMapping("/upload")
    public Map uploadFile(@RequestParam("file") MultipartFile file) {
        return cloudinaryService.uploadFile(file);
    }

    // New endpoint to upload image and save as chat message
    @PostMapping("/uploadAndSaveMessage")
    public ChatMessage uploadFileAndSaveMessage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("senderUsername") String senderUsername,
            @RequestParam("receiverUsername") String receiverUsername) {

        Map uploadResult = cloudinaryService.uploadFile(file);
        String imageUrl = (String) uploadResult.get("secure_url");

        ChatMessage msg = new ChatMessage();
        msg.setSenderUsername(senderUsername);
        msg.setReceiverUsername(receiverUsername);
        msg.setType("image");
        msg.setContent(imageUrl);
        msg.setTimestamp(LocalDateTime.now());

        chatRepo.save(msg);
        return msg;
    }
}
