import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { defaultTheme as theme } from './styles/themes';
import { OnionHeroSection } from './components/templates/OnionHeroSection';

/**
 * CTA 핸들러는 추후 연결 예정.
 * onGetInTouch — Let's Connect 버튼
 * onViewWork   — View Work 버튼
 */
function App() {
  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline />
      <OnionHeroSection
        onGetInTouch={ () => {} }
        onViewWork={ () => {} }
      />
    </ThemeProvider>
  );
}

export default App;
