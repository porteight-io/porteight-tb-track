import HeroPage from "./pages/HeroPage";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";
import { googleMapsApiKey } from "../lib/public-env";

export default function Home() {
  return (
    <HeroPage
      googleMapsApiKey={googleMapsApiKey}
    />
  );
}
