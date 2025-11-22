-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    "senderEmail" VARCHAR(255) NOT NULL,
    "senderRole" VARCHAR(50) NOT NULL,
    "receiverEmail" VARCHAR(255) NOT NULL,
    "receiverRole" VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    "isRead" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages("receiverEmail", "receiverRole");
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages("senderEmail", "senderRole");
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages("createdAt");