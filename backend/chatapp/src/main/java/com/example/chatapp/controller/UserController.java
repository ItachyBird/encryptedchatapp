package com.example.chatapp.controller;

import com.example.chatapp.model.User;
import com.example.chatapp.service.UserService;
import com.example.chatapp.dto.FriendRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        String result = userService.register(user);
        return result.equals("User registered successfully")
                ? ResponseEntity.ok(result)
                : ResponseEntity.badRequest().body(result);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        String username = userService.login(user.getEmail(), user.getPassword());
        return (username == null)
                ? ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"))
                : ResponseEntity.ok(Map.of("username", username));
    }

    @GetMapping("/search")
    public ResponseEntity<User> searchByUsername(@RequestParam String username) {
        User user = userService.findByUsername(username);
        return (user == null) ? ResponseEntity.notFound().build() : ResponseEntity.ok(user);
    }

    @PostMapping("/add-friend")
    public ResponseEntity<String> sendFriendRequest(@RequestBody FriendRequest request) {
        String result = userService.sendFriendRequest(request.getUsername(), request.getFriendUsername());

        return switch (result) {
            case "User not found" -> ResponseEntity.status(404).body(result);
            case "Friend already exists" -> ResponseEntity.status(409).body(result);
            case "Friend request already sent", "User has sent you a friend request. Accept it instead.", "Cannot send friend request to yourself" ->
                    ResponseEntity.badRequest().body(result);
            case "Friend request sent" -> ResponseEntity.ok(result);
            default -> ResponseEntity.badRequest().body(result);
        };
    }

    @GetMapping("/friend-requests")
    public ResponseEntity<List<String>> getFriendRequests(@RequestParam String username) {
        return ResponseEntity.ok(userService.getFriendRequests(username));
    }

    @PostMapping("/accept-friend-request")
    public ResponseEntity<String> acceptFriendRequest(@RequestBody FriendRequest request) {
        String result = userService.acceptFriendRequest(request.getUsername(), request.getFriendUsername());

        return switch (result) {
            case "User not found" -> ResponseEntity.status(404).body(result);
            case "No friend request from this user" -> ResponseEntity.badRequest().body(result);
            case "Friend request accepted" -> ResponseEntity.ok(result);
            default -> ResponseEntity.badRequest().body(result);
        };
    }

    @PostMapping("/remove-friend")
    public ResponseEntity<String> removeFriend(@RequestBody FriendRequest request) {
        String result = userService.removeFriend(request.getUsername(), request.getFriendUsername());

        return switch (result) {
            case "User not found" -> ResponseEntity.status(404).body(result);
            case "Friend removed" -> ResponseEntity.ok(result);
            default -> ResponseEntity.badRequest().body(result);
        };
    }

    @GetMapping("/friends")
    public ResponseEntity<List<String>> getFriends(@RequestParam String username) {
        return ResponseEntity.ok(userService.getFriends(username));
    }

    @PostMapping("/friend/deny")
    public ResponseEntity<String> denyFriendRequest(@RequestBody FriendRequest request) {
        String result = userService.denyFriendRequest(request.getUsername(), request.getFriendUsername());
        return ResponseEntity.ok(result);
    }

}
