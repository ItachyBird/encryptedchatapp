package com.example.chatapp.controller;

import com.example.chatapp.model.ChatMessage;
import com.example.chatapp.repository.ChatMessageRepository;
import com.example.chatapp.util.AESUtil;
import com.example.chatapp.util.CompressionUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatHistoryController {

    @Autowired
    private ChatMessageRepository chatRepo;

    @GetMapping("/{user1}/{user2}")
    public List<ChatMessage> getChat(@PathVariable String user1, @PathVariable String user2) {
        List<ChatMessage> messages = chatRepo.findChatBetweenUsers(user1, user2);

        for (ChatMessage msg : messages) {
            try {
                String type = msg.getType();
                if ("text".equals(type)) {
                    String base64CompressedEncrypted = msg.getContent();
                    if (base64CompressedEncrypted != null && !base64CompressedEncrypted.isEmpty()) {
                        byte[] compressed = Base64.getDecoder().decode(base64CompressedEncrypted);
                        String encrypted = CompressionUtil.decompress(compressed);
                        String originalText = AESUtil.decrypt(encrypted);
                        msg.setContent(originalText);
                    }
                } else if ("image".equals(type) || "video".equals(type)) {
                    // No processing needed for media URLs; keep as-is
                } else {
                    // Optional: for unknown types, you can handle or skip
                }
            } catch (Exception e) {
                e.printStackTrace();
                msg.setContent("[Error decrypting message]");
            }
        }

        return messages;
    }
}
