import { useNavigate } from "react-router-dom";
import { Container, Paper, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

// styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(10),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  textAlign: "center",
}));

const StyledDescription = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const Onboarding = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/chat");
  };

  return (
    <StyledContainer maxWidth="sm">
      <StyledPaper elevation={3}>
        <Typography variant="h4" gutterBottom>
          Добро пожаловать в Chat Voice App
        </Typography>
        <StyledDescription variant="body1" color="text.secondary">
          Введите сообщение или скажите голосом. Нажмите "Начать", чтобы
          приступить.
        </StyledDescription>
        <Button variant="contained" onClick={handleStart}>
          Начать
        </Button>
      </StyledPaper>
    </StyledContainer>
  );
};

export default Onboarding;
