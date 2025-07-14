package com.example.chatapp.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.chatapp.model.ChatMessage;
import com.example.chatapp.repository.ChatMessageRepository;
import com.example.chatapp.util.PixelJumbleUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.Map;

@Service
public class ImageEncryptService {

    @Autowired
    private ChatMessageRepository chatRepo;

    @Autowired
    private Cloudinary cloudinary;

    public ChatMessage encryptAndSaveImage(MultipartFile file, String sender, String receiver) throws Exception {
        // 1. Convert to BufferedImage
        BufferedImage original = ImageIO.read(file.getInputStream());

        // 2. Apply filter/jumble
        BufferedImage encrypted = PixelJumbleUtil.jumble(original);

        // 3. Convert to byte stream
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(encrypted, "jpg", baos); // or png
        byte[] encryptedBytes = baos.toByteArray();
        InputStream is = new ByteArrayInputStream(encryptedBytes);

        // 4. Upload to Cloudinary
        Map uploadResult = cloudinary.uploader().upload(is, ObjectUtils.emptyMap());
        String imageUrl = (String) uploadResult.get("secure_url");

        // 5. Save to DB
        ChatMessage msg = new ChatMessage();
        msg.setSenderUsername(sender);
        msg.setReceiverUsername(receiver);
        msg.setType("image_encrypted");
        msg.setContent(imageUrl);
        msg.setTimestamp(LocalDateTime.now());

        return chatRepo.save(msg);
    }

    public byte[] decryptImageContent(String imageUrl) throws Exception {
        // 1. Download image
        URL url = new URL(imageUrl);
        BufferedImage encryptedImage = ImageIO.read(url);

        // 2. Decrypt (reverse jumble)
        BufferedImage original = PixelJumbleUtil.unjumble(encryptedImage);

        // 3. Convert to bytes
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(original, "jpg", baos);
        return baos.toByteArray();
    }
}
