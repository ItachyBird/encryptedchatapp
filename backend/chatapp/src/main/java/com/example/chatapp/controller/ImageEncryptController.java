package com.example.chatapp.controller;

import com.example.chatapp.model.ChatMessage;
import com.example.chatapp.repository.ChatMessageRepository;
import com.example.chatapp.service.ImageEncryptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/media")
@CrossOrigin(origins = "http://localhost:3000")
public class ImageEncryptController {

    @Autowired
    private ImageEncryptService imageEncryptService;

    @Autowired
    private ChatMessageRepository chatRepo;

    // Upload image -> encrypt -> save as message
    @PostMapping("/uploadEncrypted")
    public ChatMessage uploadEncryptedImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("senderUsername") String senderUsername,
            @RequestParam("receiverUsername") String receiverUsername) throws Exception {
        return imageEncryptService.encryptAndSaveImage(file, senderUsername, receiverUsername);
    }

    // Fetch decrypted image by messageId, serve raw image bytes
    @GetMapping(value = "/decryptImage/{messageId}", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<byte[]> getDecryptedImage(@PathVariable String messageId) throws Exception {
        ChatMessage msg = chatRepo.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        if (!"image_encrypted".equals(msg.getType())) {
            throw new RuntimeException("Message is not an encrypted image");
        }

        byte[] decryptedBytes = imageEncryptService.decryptImageContent(msg.getContent());

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG) // adjust if PNG etc
                .body(decryptedBytes);
    }
}
