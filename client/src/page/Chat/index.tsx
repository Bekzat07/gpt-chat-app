import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  IconButton,
  Stack,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";

// styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(5),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
}));

const StyledStack = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const ChatPage = () => {
  const [input, setInput] = useState<string>("");
  const [response] = useState<string>("");

  const handleSend = async () => {};

  return (
    <StyledContainer maxWidth="sm">
      <StyledPaper elevation={3}>
        <Typography variant="h5" gutterBottom>
          Чат
        </Typography>

        <StyledStack direction="row" spacing={1}>
          <TextField
            fullWidth
            label="Введите сообщение"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <IconButton>
            <MicIcon />
          </IconButton>
          <IconButton onClick={handleSend} color="primary">
            <SendIcon />
          </IconButton>
        </StyledStack>
        {response && (
          <Typography
            variant="body1"
            sx={{ mt: 3, whiteSpace: "pre-line", wordBreak: "break-word" }}
          >
            Ответ: {response}
          </Typography>
        )}
      </StyledPaper>
    </StyledContainer>
  );
};

export default ChatPage;
