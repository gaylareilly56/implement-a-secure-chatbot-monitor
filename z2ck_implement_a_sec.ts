interface Message {
  id: string;
  timestamp: number;
  sender: string;
  content: string;
  encrypted: boolean;
}

interface User {
  id: string;
  username: string;
  passwordHash: string;
  conversations: Conversation[];
}

interface Conversation {
  id: string;
  name: string;
  participants: User[];
  messages: Message[];
}

interface MonitorConfig {
  allowedUsers: string[];
  sensitiveKeywords: string[];
  encryptionThreshold: number;
}

class SecureChatbotMonitor {
  private config: MonitorConfig;
  private conversations: Conversation[];

  constructor(config: MonitorConfig) {
    this.config = config;
    this.conversations = [];
  }

  addConversation(conversation: Conversation) {
    this.conversations.push(conversation);
  }

  monitorMessages() {
    this.conversations.forEach((conversation) => {
      conversation.messages.forEach((message) => {
        if (!this.config.allowedUsers.includes(message.sender)) {
          console.log(`Unauthorized user ${message.sender} sent message`);
        }
        if (this.config.sensitiveKeywords.some((keyword) => message.content.includes(keyword))) {
          console.log(`Sensitive keyword detected in message ${message.id}`);
        }
        if (message.encrypted && message.timestamp > this.config.encryptionThreshold) {
          console.log(`Encrypted message ${message.id} is older than threshold`);
        }
      });
    });
  }
}

const monitorConfig: MonitorConfig = {
  allowedUsers: ['admin', 'moderator'],
  sensitiveKeywords: ['credit', 'password'],
  encryptionThreshold: 3600000, // 1 hour in milliseconds
};

const secureChatbotMonitor = new SecureChatbotMonitor(monitorConfig);

// Example usage:
const user1: User = {
  id: 'user1',
  username: 'user1',
  passwordHash: 'hashedpassword',
  conversations: [],
};

const user2: User = {
  id: 'user2',
  username: 'user2',
  passwordHash: 'hashedpassword',
  conversations: [],
};

const conversation: Conversation = {
  id: 'conv1',
  name: 'Conversation 1',
  participants: [user1, user2],
  messages: [],
};

secureChatbotMonitor.addConversation(conversation);

const message1: Message = {
  id: 'msg1',
  timestamp: 1643723400,
  sender: 'user1',
  content: 'Hello',
  encrypted: true,
};

const message2: Message = {
  id: 'msg2',
  timestamp: 1643723410,
  sender: 'user2',
  content: 'My credit card is 1234-5678-9012-3456',
  encrypted: false,
};

conversation.messages.push(message1);
conversation.messages.push(message2);

secureChatbotMonitor.monitorMessages();