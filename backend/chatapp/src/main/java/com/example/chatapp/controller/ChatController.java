package com.example.chatapp.controller;

import com.example.chatapp.model.ChatMessage;
import com.example.chatapp.repository.ChatMessageRepository;
import com.example.chatapp.util.AESUtil;
import com.example.chatapp.util.CompressionUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.Base64;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatMessageRepository chatRepo;

    @MessageMapping("/chat")
    public void sendMessage(@Payload ChatMessage message) {
        try {
            message.setTimestamp(LocalDateTime.now());

            String type = message.getType();

            if ("text".equalsIgnoreCase(type)) {
                // Encrypt + compress text content before storing
                String encrypted = AESUtil.encrypt(message.getContent());
                byte[] compressed = CompressionUtil.compress(encrypted);
                String base64CompressedEncrypted = Base64.getEncoder().encodeToString(compressed);
                message.setContent(base64CompressedEncrypted);

            } else if ("image".equalsIgnoreCase(type) || "video".equalsIgnoreCase(type)) {
                // Image/video content is already a URL - store as-is, no encryption

            } else {
                // Unsupported message type: log and skip or throw exception
                System.err.println("Unsupported message type received: " + type);
                throw new IllegalArgumentException("Unsupported message type: " + type);
            }

            // Save message to MongoDB
            chatRepo.save(message);

            // Send the message to receiver's queue
            messagingTemplate.convertAndSendToUser(
                    message.getReceiverUsername(),
                    "/queue/messages",
                    message
            );

        } catch (Exception e) {
            // Log error, avoid app crash on failure
            e.printStackTrace();
        }
    }
}
