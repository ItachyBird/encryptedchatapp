package com.example.chatapp.util;

import java.awt.image.BufferedImage;

public class PixelJumbleUtil {

    public static BufferedImage jumble(BufferedImage img) {
        BufferedImage out = new BufferedImage(img.getWidth(), img.getHeight(), img.getType());
        for (int y = 0; y < img.getHeight(); y++) {
            for (int x = 0; x < img.getWidth(); x++) {
                int newX = (x + 13) % img.getWidth(); // basic jumble logic
                int newY = (y + 7) % img.getHeight();
                out.setRGB(newX, newY, img.getRGB(x, y));
            }
        }
        return out;
    }

    public static BufferedImage unjumble(BufferedImage img) {
        BufferedImage out = new BufferedImage(img.getWidth(), img.getHeight(), img.getType());
        for (int y = 0; y < img.getHeight(); y++) {
            for (int x = 0; x < img.getWidth(); x++) {
                int origX = (x - 13 + img.getWidth()) % img.getWidth();
                int origY = (y - 7 + img.getHeight()) % img.getHeight();
                out.setRGB(origX, origY, img.getRGB(x, y));
            }
        }
        return out;
    }
}
