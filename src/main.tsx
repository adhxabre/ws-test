// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from "react-router-dom";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
	// <StrictMode>
	<QueryClientProvider client={new QueryClient()}>
		<Router>
			<App />
		</Router>
	</QueryClientProvider>,
	// </StrictMode>,
);
