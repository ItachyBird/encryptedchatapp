package com.example.chatapp.repository;

import com.example.chatapp.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {

    // Fetch all messages between two users (sent and received)
    @Query("{$or: [" +
            "  { $and: [ { 'senderUsername': ?0 }, { 'receiverUsername': ?1 } ] }, " +
            "  { $and: [ { 'senderUsername': ?1 }, { 'receiverUsername': ?0 } ] } " +
            "]}")
    List<ChatMessage> findChatBetweenUsers(String user1, String user2);
}
