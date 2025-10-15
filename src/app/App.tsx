import { AppRouterProvider, QueryProvider, ThemeProvider } from '@app/providers';
import GlobalStyle from '@app/styles/GlobalStyle.tsx';

function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <GlobalStyle />
        <AppRouterProvider />
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;
