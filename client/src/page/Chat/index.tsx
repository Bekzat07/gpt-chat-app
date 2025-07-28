import { useState, useRef, useEffect } from "react";
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
  CircularProgress,
  useMediaQuery,
  Snackbar,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";

// init
import baseService from "../../init/baseService";

// utils
import { getErrorMessage } from "../../utils/getErrorMessage";

// types
import type {
  ChatMessage,
  SpeechRecognitionErrorEvent,
  SpeechRecognitionEvent,
} from "../../types/speech";

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
    SpeechRecognition: new () => SpeechRecognition;
  }
}

const SpeechRecognitionConstructor =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition: SpeechRecognition | null = SpeechRecognitionConstructor
  ? new SpeechRecognitionConstructor()
  : null;

// Styled components
const FullHeightContainer = styled(Container)(() => ({
  minHeight: "100dvh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  padding: 0,
  paddingTop: 16,
  paddingBottom: 16,
}));

const ChatWrapper = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  width: "100%",
  maxWidth: 600,
  borderRadius: theme.spacing(3),
  padding: theme.spacing(2),
  boxSizing: "border-box",
}));

const MessagesBox = styled(Box)(() => ({
  flexGrow: 1,
  overflowY: "auto",
  paddingBottom: "1rem",
}));

const ChatPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [snack, setSnack] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const interimTranscriptRef = useRef("");

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isListening) {
      timerRef.current = window.setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      setTimerSeconds(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isListening]);

  const formatTimer = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

  const formatTimestamp = (d: Date) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
      timestamp: formatTimestamp(new Date()),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data } = await baseService.post(
        `${import.meta.env.VITE_API_URL}/api/v1/chat`,
        { messages: [{ role: "user", content: input }] }
      );

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.response,
        timestamp: formatTimestamp(new Date()),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const message = getErrorMessage(error);
      setSnack(message || "Ошибка при отправке");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = () => {
    if (!recognition) {
      setSnack("Ваш браузер не поддерживает голосовой ввод 😢");
      return;
    }

    if (isListening) {
      recognition.stop();
      return;
    }

    interimTranscriptRef.current = "";

    recognition.lang = "ru-RU";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setInput((prev) => prev + interimTranscriptRef.current.trim() + " ");
      interimTranscriptRef.current = "";
      setIsListening(false);
    };
    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      setSnack(e.error);
      setIsListening(false);
    };
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      interimTranscriptRef.current = transcript;
    };

    recognition.start();
  };

  return (
    <FullHeightContainer maxWidth={false}>
      <ChatWrapper elevation={3}>
        <Typography variant="h6" gutterBottom>
          Чат с Alash-AI
        </Typography>

        {isListening && (
          <Typography variant="caption" color="error" gutterBottom>
            🎤 Голосовой ввод включен • {formatTimer(timerSeconds)}
          </Typography>
        )}

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
                        msg.role === "user" ? "#e3f2fd" : "#f1f8e9",
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

        <Stack direction="row" spacing={1} alignItems="center" mt={1}>
          <TextField
            fullWidth
            label="Введите сообщение"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isLoading}
            size={isMobile ? "small" : "medium"}
          />
          <IconButton
            onClick={handleMicClick}
            color={isListening ? "error" : "default"}
            disabled={isLoading}
            size="large"
          >
            <MicIcon />
          </IconButton>
          <IconButton
            onClick={handleSend}
            color="primary"
            disabled={isLoading}
            size="large"
          >
            {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
          </IconButton>
        </Stack>
      </ChatWrapper>

      <Snackbar
        open={!!snack}
        autoHideDuration={4000}
        onClose={() => setSnack(null)}
        message={snack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </FullHeightContainer>
  );
};

export default ChatPage;
