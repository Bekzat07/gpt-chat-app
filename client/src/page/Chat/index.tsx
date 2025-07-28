import { useEffect, useRef, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  IconButton,
  Stack,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import baseService from "../../init/baseService";
import { getErrorMessage } from "../../utils/getErrorMessage";

// styled components
const FullHeightContainer = styled(Container)(() => ({
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const ChatWrapper = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "90vh",
  width: "100%",
  maxWidth: 600,
  padding: theme.spacing(2),
  borderRadius: theme.spacing(3),
}));

const MessagesBox = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  marginBottom: theme.spacing(2),
}));

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

const ChatPage = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTimestamp = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
      timestamp: formatTimestamp(new Date()),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const { data } = await baseService.post(
        `${import.meta.env.VITE_API_URL}/api/v1/chat`,
        {
          messages: [{ role: "user", content: input }],
        }
      );

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.response,
        timestamp: formatTimestamp(new Date()),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setInput("");
    } catch (error) {
      getErrorMessage(error);
    }
  };

  return (
    <FullHeightContainer>
      <ChatWrapper elevation={3}>
        <Typography variant="h5" gutterBottom>
          Чат с GPT
        </Typography>

        <MessagesBox>
          <List>
            {messages.map((msg, idx) => (
              <div key={idx}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    flexDirection: msg.role === "user" ? "row-reverse" : "row",
                    textAlign: msg.role === "user" ? "right" : "left",
                  }}
                >
                  <ListItemText
                    primary={msg.content}
                    secondary={`${msg.role === "user" ? "Вы" : "GPT"} • ${
                      msg.timestamp
                    }`}
                    sx={{
                      backgroundColor:
                        msg.role === "user" ? "#e0f7fa" : "#f1f8e9",
                      borderRadius: 2,
                      padding: 1.5,
                      maxWidth: "80%",
                    }}
                  />
                </ListItem>
                <Divider />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </List>
        </MessagesBox>

        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            label="Введите сообщение"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <IconButton>
            <MicIcon />
          </IconButton>
          <IconButton onClick={handleSend} color="primary">
            <SendIcon />
          </IconButton>
        </Stack>
      </ChatWrapper>
    </FullHeightContainer>
  );
};

export default ChatPage;
