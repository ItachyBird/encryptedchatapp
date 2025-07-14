package com.example.chatapp.service;

import com.example.chatapp.model.User;
import com.example.chatapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String register(User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return "User already exists";
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return "User registered successfully";
    }

    public String login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return userOpt.get().getUsername();
        }
        return null;
    }

    public User findByUsername(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        return userOpt.orElse(null);
    }

    public String sendFriendRequest(String senderUsername, String receiverUsername) {
        if (senderUsername.equals(receiverUsername)) {
            return "Cannot send friend request to yourself";
        }

        Optional<User> senderOpt = userRepository.findByUsername(senderUsername);
        Optional<User> receiverOpt = userRepository.findByUsername(receiverUsername);

        if (senderOpt.isEmpty() || receiverOpt.isEmpty()) {
            return "User not found";
        }

        User sender = senderOpt.get();
        User receiver = receiverOpt.get();

        if (sender.getFriends().contains(receiverUsername)) {
            return "Friend already exists";
        }

        if (sender.getPendingRequests().contains(receiverUsername)) {
            return "Friend request already sent";
        }

        if (sender.getFriendRequests().contains(receiverUsername)) {
            return "User has sent you a friend request. Accept it instead.";
        }

        sender.getPendingRequests().add(receiverUsername);
        receiver.getFriendRequests().add(senderUsername);

        userRepository.save(sender);
        userRepository.save(receiver);

        return "Friend request sent";
    }

    public List<String> getFriendRequests(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        return userOpt.map(User::getFriendRequests).orElse(List.of());
    }

    public String acceptFriendRequest(String username, String requesterUsername) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        Optional<User> requesterOpt = userRepository.findByUsername(requesterUsername);

        if (userOpt.isEmpty() || requesterOpt.isEmpty()) {
            return "User not found";
        }

        User user = userOpt.get();
        User requester = requesterOpt.get();

        if (!user.getFriendRequests().remove(requesterUsername)) {
            return "No friend request from this user";
        }

        // ✅ Remove from requester's pendingRequests
        requester.getPendingRequests().remove(username);

        if (!user.getFriends().contains(requesterUsername)) {
            user.getFriends().add(requesterUsername);
        }
        if (!requester.getFriends().contains(username)) {
            requester.getFriends().add(username);
        }

        userRepository.save(user);
        userRepository.save(requester);
        return "Friend request accepted";
    }

    public String removeFriend(String username, String friendUsername) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        Optional<User> friendOpt = userRepository.findByUsername(friendUsername);

        if (userOpt.isEmpty() || friendOpt.isEmpty()) {
            return "User not found";
        }

        User user = userOpt.get();
        User friend = friendOpt.get();

        boolean removed = user.getFriends().remove(friendUsername);
        removed |= friend.getFriends().remove(username);

        if (removed) {
            userRepository.save(user);
            userRepository.save(friend);
            return "Friend removed";
        }

        return "Friend not found";
    }

    public List<String> getFriends(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        return userOpt.map(User::getFriends).orElse(List.of());
    }

    public String denyFriendRequest(String username, String requesterUsername) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        Optional<User> requesterOpt = userRepository.findByUsername(requesterUsername);

        if (userOpt.isEmpty() || requesterOpt.isEmpty()) {
            return "User not found";
        }

        User user = userOpt.get();
        User requester = requesterOpt.get();

        boolean removedFromRequests = user.getFriendRequests().remove(requesterUsername);
        boolean removedFromPending = requester.getPendingRequests().remove(username);

        if (removedFromRequests || removedFromPending) {
            userRepository.save(user);
            userRepository.save(requester);
            return "Friend request denied";
        }

        return "No such friend request found";
    }
}
